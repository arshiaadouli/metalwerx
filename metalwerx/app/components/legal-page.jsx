import Link from "next/link";
import {
  Banknote,
  Building2,
  Car,
  ChartColumn,
  Clock,
  Database,
  FileText,
  Globe,
  Info,
  Link2,
  Lock,
  Mail,
  Monitor,
  Network,
  Scale,
  Server,
  ShieldCheck,
  TriangleAlert,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CutTitle, Enter } from "@/components/ui/enter";
import { Reveal } from "@/components/ui/reveal";
import { ScrollLink } from "@/components/ui/scroll-link";

// A legal page, such as /privacy or /terms, from its text in the CMS (see
// lib/cms.js): a header, the sections with an "On this page" list linking to
// them, and a closing call to action. Each section has topics, and each topic
// is a list of blocks: paragraphs, questions and answers, callouts, an address
// or a list. icon is drawn large behind the header, and is the fallback for a
// section whose icon isn't known here; badgeIcon marks the header's eyebrow.
export function LegalPage({ hero, sections, cta, icon: Icon, badgeIcon: BadgeIcon }) {
  // <main> takes in the header, so the h1 is part of the main content and the
  // header isn't read as a second site banner.
  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      {/* Neutral, like the Blog page's header: red is kept to small accents so
          the page reads as reassuring rather than as a warning. */}
      <header className="relative overflow-hidden border-b border-line bg-linear-to-br from-panel to-surface">
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className="absolute -right-16 -bottom-24 hidden size-[28rem] rotate-12 text-ink/5 sm:block"
        />
        {/* Plays on load, one step after another (see components/ui/enter.jsx). */}
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Enter
            as="p"
            step={0}
            className="inline-flex items-center gap-2 rounded-full bg-well px-4 py-1.5 font-oswald text-xs uppercase tracking-[0.3em] text-ink-soft ring-1 ring-line"
          >
            <BadgeIcon aria-hidden="true" className="size-3.5 text-ink-cherry" />
            {hero.eyebrow}
          </Enter>
          <h1 className="mt-5 font-bebas-neue text-7xl tracking-wide text-ink sm:text-8xl">
            <CutTitle step={1}>{hero.title}</CutTitle>
          </h1>
          <Enter step={2} className="mt-4 h-1 w-16 bg-cherry" />
          <Enter as="p" step={2} className="mt-8 max-w-2xl text-lg leading-8 text-ink-soft">
            {hero.intro}
          </Enter>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
        <nav
          aria-label="On this page"
          className="rounded-2xl border border-line bg-panel p-5 lg:sticky lg:top-8 lg:self-start"
        >
          <p className="px-2 font-oswald text-xs uppercase tracking-[0.3em] text-ink-muted">
            On this page
          </p>
          {/* The links slide in one by one, like the Contact page's, and ease
              the page down to their section. */}
          <ol className="mt-4 space-y-1">
            {sections.map(({ anchor, title, icon }, i) => {
              const SectionIcon = sectionIcons[icon] ?? Icon;
              return (
                <Reveal as="li" key={anchor} variant="slide" step={i}>
                  <ScrollLink
                    href={`#${anchor}`}
                    title={title}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm leading-5 text-ink-soft transition-colors hover:bg-well hover:text-ink focus-visible:bg-well focus-visible:text-ink focus-visible:outline-none"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-well text-ink-muted ring-1 ring-line transition-colors group-hover:bg-surface group-hover:text-ink-cherry group-focus-visible:bg-surface group-focus-visible:text-ink-cherry">
                      <SectionIcon aria-hidden="true" className="size-4" />
                    </span>
                    {title}
                  </ScrollLink>
                </Reveal>
              );
            })}
          </ol>
        </nav>

        <div className="mt-12 space-y-12 lg:mt-0">
          {sections.map(({ anchor: id, title, icon, topics }, i) => {
            const SectionIcon = sectionIcons[icon] ?? Icon;
            return (
              <section
                key={id}
                id={id}
                aria-labelledby={`${id}-heading`}
                className="scroll-mt-8 overflow-hidden rounded-2xl border border-line bg-panel"
              >
                <div className="flex items-center gap-5 border-b border-line px-6 py-6 sm:px-8">
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-well text-ink-cherry ring-1 ring-line">
                    <SectionIcon aria-hidden="true" className="size-7" />
                  </span>
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.3em] text-ink-muted">
                      Section {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2
                      id={`${id}-heading`}
                      className="mt-1 font-bebas-neue text-3xl leading-none tracking-wide text-ink sm:text-4xl"
                    >
                      {title}
                    </h2>
                  </div>
                </div>
                <div className="space-y-12 px-6 py-8 sm:px-8 sm:py-10">
                  {topics.map((topic) => (
                    <Topic key={topic.id} title={topic.title}>
                      {topic.content.map((block) => (
                        <ContentBlock key={block.id} block={block} />
                      ))}
                    </Topic>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <Reveal>
            <h2 className="font-bebas-neue text-4xl tracking-wide text-ink sm:text-5xl">
              {cta.heading}
            </h2>
            {cta.body && <p className="mt-2 text-ink-soft">{cta.body}</p>}
          </Reveal>
          <Reveal step={1}>
            <Button
              asChild
              size="lg"
              className="bg-cherry font-oswald uppercase tracking-[0.15em] text-white hover:bg-cherry-dark"
            >
              <Link href={cta.buttonHref} title={cta.buttonText}>
                {cta.buttonText}
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function Topic({ title, children }) {
  return (
    <div>
      <h3 className="flex items-center gap-3 font-oswald text-xl font-semibold uppercase tracking-[0.12em] text-ink">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-cherry" />
        {title}
      </h3>
      <div className="mt-4 space-y-4 leading-7 text-ink-soft">{children}</div>
    </div>
  );
}

function QA({ question, children }) {
  return (
    <div className="rounded-xl border border-line bg-well p-5">
      <h4 className="font-semibold text-ink">{question}</h4>
      <div className="mt-3 space-y-3 text-sm leading-6 text-ink-soft">{children}</div>
    </div>
  );
}

function Callout({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-line bg-well p-5 text-ink">
      <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 font-oswald text-xs uppercase tracking-[0.25em] text-ink-soft ring-1 ring-line">
        <Icon aria-hidden="true" className="size-3.5 text-ink-cherry" />
        {label}
      </p>
      <p className="mt-3 leading-7">{children}</p>
    </div>
  );
}

// One block of a topic, by its type in the CMS. Long text fields hold one or
// more paragraphs, separated by blank lines.
function ContentBlock({ block }) {
  switch (block.blockType) {
    case "paragraph":
      return paragraphs(block.text).map((text, i) => <p key={i}>{text}</p>);
    case "questions":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <QA key={item.id} question={item.question}>
              {paragraphs(item.answer).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </QA>
          ))}
        </div>
      );
    case "callout":
      return block.kind === "note" ? (
        <Callout icon={Info} label="Please note">
          {block.text}
        </Callout>
      ) : (
        <Callout icon={Scale} label="Legal basis">
          {block.text}
        </Callout>
      );
    case "address":
      return (
        <address className="flex items-center gap-4 rounded-xl border border-line bg-well p-5 font-semibold not-italic text-ink">
          <Building2 aria-hidden="true" className="size-6 shrink-0 text-ink-cherry" />
          <span className="whitespace-pre-line">{block.text}</span>
        </address>
      );
    case "iconList":
      return (
        <ul className="grid gap-3 sm:grid-cols-2">
          {block.items.map(({ id, label, icon }) => {
            const Icon = listIcons[icon] ?? Info;
            return (
              <li
                key={id}
                className="flex items-center gap-3 rounded-lg bg-well px-4 py-3 text-sm text-ink"
              >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-ink-muted" />
                {label}
              </li>
            );
          })}
        </ul>
      );
    default:
      return null;
  }
}

function paragraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

// The icons the CMS can name for a section and for a list item.
const sectionIcons = {
  "shield-check": ShieldCheck,
  info: Info,
  database: Database,
  "chart-column": ChartColumn,
  mail: Mail,
  lock: Lock,
  scale: Scale,
  "file-text": FileText,
  banknote: Banknote,
  car: Car,
  truck: Truck,
  "triangle-alert": TriangleAlert,
  globe: Globe,
};

const listIcons = {
  globe: Globe,
  monitor: Monitor,
  link: Link2,
  server: Server,
  clock: Clock,
  network: Network,
};
