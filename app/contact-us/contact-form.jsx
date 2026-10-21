"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CircleAlert, Mail, MailOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";

// The contact form. There's no backend yet, so it never claims to send
// anything itself: it checks the fields, then opens the visitor's email app
// with a message to the yard, filled in from the form. What they typed stays
// in the form in case their email app doesn't open.
//
// Until this script runs, the browser's own checks (required, type="email")
// and the form's mailto: action do the same job without it.

const FIELDS = ["name", "phone", "email", "message"];

// The error for one field, or null when it's fine. Each one says what to do.
function check(field, raw) {
  const value = raw.trim();
  switch (field) {
    case "name":
      return value ? null : "Enter your full name";
    case "phone": {
      if (!value) return null;
      const digits = value.replace(/\D/g, "").length;
      return /^[\d\s()+.-]+$/.test(value) && digits >= 8 && digits <= 15
        ? null
        : "Enter a phone number, like 0400 000 000, or leave it blank";
    }
    case "email":
      if (!value) return "Enter your email address";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter an email address like you@example.com";
    case "message":
      return value ? null : "Enter your message";
    default:
      return null;
  }
}

// A mailto: link to the yard, with the subject and body written from the
// form. mailto: bodies take CRLF line breaks.
function emailHref(values) {
  const name = values.name.trim();
  const phone = values.phone.trim();
  const lines = [values.message.trim(), "", `Name: ${name}`];
  if (phone) lines.push(`Phone: ${phone}`);
  lines.push(`Email: ${values.email.trim()}`);
  const subject = `Website enquiry from ${name}`;
  const body = lines.join("\n").replace(/\r?\n/g, "\r\n");
  return `${YARD.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Once this script is running it shows its own errors, so the browser's
// bubbles stand down.
function takeOverValidation(form) {
  if (form) form.noValidate = true;
}

export function ContactForm() {
  const [errors, setErrors] = useState({});
  // How many times the form has opened the email app; keys the notice.
  const [handoffs, setHandoffs] = useState(0);
  const statusRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(FIELDS.map((field) => [field, form.elements.namedItem(field).value]));
    const found = {};
    for (const field of FIELDS) {
      const error = check(field, values[field]);
      if (error) found[field] = error;
    }
    const first = FIELDS.find((field) => found[field]);
    if (first) {
      // The errors render before focus moves, so a screen reader reads the
      // first one along with its field.
      flushSync(() => {
        setErrors(found);
        setHandoffs(0);
      });
      form.elements.namedItem(first).focus();
      return;
    }
    flushSync(() => {
      setErrors({});
      setHandoffs((count) => count + 1);
    });
    // The next step stays in view for when they come back from the email app.
    statusRef.current?.scrollIntoView({ block: "nearest" });
    window.location.href = emailHref(values);
  }

  // On the way past, a field is only flagged if something's typed in it and
  // it's wrong. Empty fields wait for the submit.
  function handleBlur(event) {
    const { name, value } = event.target;
    if (!FIELDS.includes(name) || (!value.trim() && !errors[name])) return;
    const error = check(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  // An error clears as soon as it's fixed.
  function handleChange(event) {
    const { name, value } = event.target;
    if (errors[name] && !check(name, value)) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  // Return in a one-line field moves to the next one, rather than sending a
  // half-filled form (and flagging the fields still to come).
  function handleKeyDown(event) {
    const { target } = event;
    if (event.key !== "Enter" || event.nativeEvent.isComposing || target.tagName !== "INPUT") return;
    const fields = FIELDS.map((field) => event.currentTarget.elements.namedItem(field));
    const next = fields[fields.indexOf(target) + 1];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return (
    <form
      ref={takeOverValidation}
      action={YARD.emailHref}
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="mt-8 grid gap-6 sm:grid-cols-2"
    >
      <Field name="name" label="Full name" error={errors.name}>
        {(props) => (
          <input
            {...props}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            required
            placeholder="Jane Citizen"
            className={cn(control, "h-12")}
          />
        )}
      </Field>
      <Field name="phone" label="Phone" optional error={errors.phone}>
        {(props) => (
          <input
            {...props}
            type="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder="0400 000 000"
            className={cn(control, "tabular h-12")}
          />
        )}
      </Field>
      <Field name="email" label="Email address" error={errors.email} className="sm:col-span-2">
        {(props) => (
          <input
            {...props}
            type="email"
            autoComplete="email"
            spellCheck={false}
            enterKeyHint="next"
            required
            placeholder="you@example.com"
            className={cn(control, "h-12")}
          />
        )}
      </Field>
      <Field
        name="message"
        label="Message"
        hint="What metal you have, roughly how much, and where it is."
        error={errors.message}
        className="sm:col-span-2"
      >
        {(props) => <textarea {...props} rows={5} required className={cn(control, "min-h-32 resize-y py-3")} />}
      </Field>

      <div className="mt-2 sm:col-span-2">
        <Button type="submit" variant="outline" size="lg" aria-describedby="contact-send-note" className="w-full sm:w-auto">
          <Mail aria-hidden="true" />
          Send by email
        </Button>
        <p id="contact-send-note" className="mt-3 text-[0.9375rem] text-ink-soft">
          {/* The link says more than the number, which the header's button
              already shows as its link text. */}
          This opens your email app with your message. Or{" "}
          <a href={YARD.phoneHref} className="tabular font-bold text-ink underline hover:no-underline">
            ring us on {YARD.phone}
          </a>
          .
        </p>
        <div ref={statusRef} role="status" className="scroll-mb-6">
          {handoffs > 0 && <Handoff key={handoffs} />}
        </div>
      </div>
    </form>
  );
}

// Flat white fields on the sunk plate, edged in ink-muted (the input token is
// too faint to mark a field's edge at 3:1). Autofill keeps the field's own
// colours rather than the browser's tint.
const control =
  "mt-2 block w-full scroll-mt-32 rounded-[2px] border border-ink-muted bg-raised px-4 text-[1.0625rem] text-ink transition-[border-color,box-shadow] duration-150 ease-out-expo placeholder:text-ink-muted hover:border-ink focus:border-ink aria-invalid:border-destructive aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] autofill:shadow-[inset_0_0_0_100px_var(--raised)] autofill:[-webkit-text-fill-color:var(--ink)]";

// A label, an optional hint, the control, and its error underneath, all
// joined to the control by id. children is a function that takes the
// control's id, name and ARIA props.
function Field({ name, label, optional = false, hint, error, className, children }) {
  const id = `contact-${name}`;
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.9375rem] font-bold text-ink">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
          {hint}
        </p>
      )}
      {children({ id, name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error && (
        <p
          id={errorId}
          className="mt-2 flex animate-in gap-2 text-[0.9375rem] leading-snug font-semibold text-destructive duration-200 ease-out-expo fade-in-0 slide-in-from-top-1"
        >
          <CircleAlert aria-hidden="true" strokeWidth={2.25} className="mt-px size-[1.125rem] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// What the visitor sees once their email app has been asked to open: the
// message still needs sending from there, and what to do if nothing opened.
function Handoff() {
  return (
    <div className="mt-6 flex animate-in gap-3 border-t border-rule pt-5 duration-200 ease-out-expo fade-in-0 slide-in-from-top-1">
      <MailOpen aria-hidden="true" strokeWidth={1.75} className="mt-0.5 size-5 shrink-0 text-ink" />
      <div>
        <p className="font-bold text-ink">Now press send in your email app</p>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          We&apos;ve filled in your message. If your email app didn&apos;t open, email us at{" "}
          <a href={YARD.emailHref} className="font-bold text-ink underline hover:no-underline">
            {YARD.email}
          </a>{" "}
          or call{" "}
          <a href={YARD.phoneHref} className="tabular font-bold text-ink underline hover:no-underline">
            {YARD.phone}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
