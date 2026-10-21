import Link from "next/link";
import {
  Building2,
  Clock,
  Globe,
  Link2,
  Monitor,
  Network,
  Scale,
  Server,
  TriangleAlert,
} from "lucide-react";
import { Breadcrumbs, Container } from "@/app/services/sections";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { YARD } from "@/lib/yard";

export const metadata = pageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy",
  description:
    "How Metal Werx collects, uses and protects your personal data when you visit or use our website.",
});

// A page to read: the site's frame (breadcrumbs, the title, the band that
// closes the page) around one calm column of text. Each section opens on
// a 2px ink rule. From lg the contents stay beside the text, their rule lined
// up with the first section's; they stick at the same height a jump to a
// section lands on (scroll-mt-24), so the two rules meet again after each jump.
export default function PrivacyPolicyPage() {
  // <main> takes in the header, so the h1 is part of the main content and the
  // header isn't read as a second site banner.
  return (
    <main id="main" className="flex-1">
      <header className="pt-8 pb-14 sm:pt-10 sm:pb-20">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]} />
          <h1 className="mt-10 type-title text-ink sm:mt-14">Privacy Policy</h1>
          <p className="mt-6 max-w-[58ch] type-lede text-ink-soft">
            What personal information we collect when you visit or use our website, why we collect
            it, and how we handle it.
          </p>
        </Container>
      </header>

      {/* From xl the gap puts the reading column's centre on the page's
          centre, with the contents in the margin beside it. */}
      <Container className="pb-20 sm:pb-28 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-x-12 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-x-24">
        <Contents />

        {/* 56ch of Archivo, whose zero is wide, sets about 70 characters to
            the line. */}
        <div className="mt-14 max-w-[56ch] space-y-20 text-pretty text-ink-soft sm:space-y-28 lg:mt-0">
          {sections.map(({ id, title, Body }) => (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
              className="scroll-mt-24 border-t-2 border-ink pt-5 sm:pt-6"
            >
              <h2 id={`${id}-heading`} className="type-heading text-ink">
                {title}
              </h2>
              <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14">
                <Body />
              </div>
            </section>
          ))}
        </div>
      </Container>

      <section aria-labelledby="data-questions" className="border-t border-rule">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <h2 id="data-questions" className="type-heading text-ink">
              Questions about your data?
            </h2>
            <p className="mt-3 max-w-[48ch] type-lede text-ink-soft">
              Get in touch about any request to see, correct or delete your personal information.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Button asChild size="lg" className="max-sm:w-full">
              <Link href="/contact-us">
                Contact us
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}

// The contents: plain anchors, since the page already glides to an anchor
// unless the visitor asks for less motion (app/globals.css). Below lg they sit
// above the text; from lg they stay in view beside it.
function Contents() {
  return (
    <nav
      aria-labelledby="contents-label"
      className="max-w-[56ch] border-t-2 border-ink pt-5 sm:pt-6 lg:sticky lg:top-24"
    >
      <p id="contents-label" className="type-meta text-ink-muted">
        On this page
      </p>
      <ol className="mt-2 divide-y divide-rule">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block py-3 text-base leading-snug font-semibold text-ink-soft transition-colors duration-150 ease-out-expo hover:text-ink hover:underline lg:text-[0.9375rem]"
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Topic({ title, children }) {
  return (
    <div>
      <h3 className="type-subheading text-ink">{title}</h3>
      <div className="mt-4 space-y-5">{children}</div>
    </div>
  );
}

// A question and its answer, one row of a ruled list (a <dl>). A <dt>, not a
// heading, so the page's outline stays at its sections and topics.
function QA({ question, children }) {
  return (
    <div className="border-b border-rule py-5">
      <dt className="text-lg leading-snug font-bold text-ink [font-stretch:104%]">{question}</dt>
      <dd className="mt-2 space-y-4">{children}</dd>
    </div>
  );
}

// A quiet plate beside the text: a small label, then the note.
function Callout({ icon: Icon, label, children }) {
  return (
    <div className="rounded-[2px] bg-sunk px-5 py-4 sm:px-6 sm:py-5">
      <p className="flex items-center gap-2 type-meta text-ink-muted">
        <Icon aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0" />
        {label}
      </p>
      <p className="mt-2 text-base/relaxed text-ink-soft">{children}</p>
    </div>
  );
}

function LegalBasis({ children }) {
  return (
    <Callout icon={Scale} label="Legal basis">
      {children}
    </Callout>
  );
}

const serverLogFields = [
  { label: "Browser type and browser version", icon: Globe },
  { label: "Operating system used", icon: Monitor },
  { label: "Referrer URL", icon: Link2 },
  { label: "Hostname of the accessing computer", icon: Server },
  { label: "Time of server request", icon: Clock },
  { label: "IP address", icon: Network },
];

function Overview() {
  return (
    <>
      <Topic title="General">
        <p>
          The following gives a simple overview of what kind of personal information we collect,
          why we collect them and how we handle your data when you are visiting or using our
          website. Personal information is any data with which you could be personally identified.
          Detailed information on the subject of data protection can be found in our privacy policy
          found below.
        </p>
      </Topic>

      {/* Not "Data collection on our website": that's the third section's
          heading, and SEO audits flag a heading that repeats. */}
      <Topic title="Your data at a glance">
        <dl className="border-t border-rule">
          <QA question="Who is responsible for the data collection on this website?">
            <p>
              The data collected on this website are processed by the website operator. The
              operator&apos;s contact details can be found in the website&apos;s required legal
              notice.
            </p>
          </QA>
          <QA question="How do we collect your data?">
            <p>
              Some data are collected when you provide them to us. This could, for example, be data
              you enter in a contact form.
            </p>
            <p>
              Other data are collected automatically by our IT systems when you visit and use our
              website. These data are primarily technical data such as the browser and operating
              system you are using or when you accessed the website. These data are collected
              automatically as soon as you enter our website.
            </p>
          </QA>
          <QA question="What do we use your data for?">
            <p>
              Part of the data is collected to ensure the proper functioning of the website. Other
              data can be used to analyze how visitors use the site.
            </p>
          </QA>
          <QA question="What rights do you have regarding your data?">
            <p>
              You always have the right to request information about your stored data, its origin,
              its recipients, and the purpose of its collection at no charge. You also have the
              right to request that your data be corrected, blocked, or deleted. You can contact us
              at any time using the address given in the legal notice if you have further questions
              about the issue of privacy and data protection. You may also, of course, file a
              complaint with the competent regulatory authorities.
            </p>
          </QA>
        </dl>
      </Topic>

      <Topic title="Analytics and third-party tools">
        <p>
          When visiting our website, statistical analyses may be made of your surfing behavior. This
          happens primarily using cookies and analytics. The analysis of your surfing behavior is
          usually anonymous, encrypted, and pseudonymized, meaning that we will not be able to
          identify you through this data. You can object to this analysis or prevent it by not using
          certain tools. Detailed information can be found in the following privacy policy.
        </p>
      </Topic>
    </>
  );
}

function GeneralInformation() {
  return (
    <>
      <Topic title="Data protection">
        <p>
          The operators of this website take the protection of your personal data very seriously. We
          treat your personal data as confidential and in accordance with the statutory data
          protection regulations and this privacy policy.
        </p>
        <p>
          If you use this website, various kinds of personal data will be collected. Personal
          information is any data with which you could be personally identified. This privacy policy
          explains what information we collect and what we use it for. It also explains how and for
          what purpose this happens.
        </p>
        <Callout icon={TriangleAlert} label="Please note">
          Data transmitted via the internet (e.g. via email communication) may be subject to
          security breaches. Complete protection of your data from third-party access is not
          possible.
        </Callout>
      </Topic>

      <Topic title="Notice concerning the party responsible for this website">
        <p>The party responsible for processing data on this website is:</p>
        {/* The operator's address, phone and email still need to be added here. */}
        <address className="flex items-center gap-3 border-y border-rule py-4 text-lg leading-snug font-bold text-ink not-italic [font-stretch:104%]">
          <Building2 aria-hidden="true" strokeWidth={1.75} className="size-5 shrink-0 text-ink-muted" />
          {YARD.name}
        </address>
        <p>
          The responsible party is the natural or legal person who alone or jointly with others
          decides on the purposes and means of processing personal data (names, email addresses,
          etc.).
        </p>
      </Topic>

      <Topic title="Revocation of your consent to the processing of your data">
        <p>
          Many data processing operations are only possible with your express consent. You may
          revoke your consent at any time with future effect. An informal email making this request
          is sufficient. Please note that data processed before we receive your request may still be
          legally processed.
        </p>
      </Topic>

      <Topic title="Right to file complaints with regulatory authorities">
        <p>
          If there has been a breach of data protection legislation, the affected person may file a
          complaint with the competent regulatory authorities.
        </p>
      </Topic>

      <Topic title="Right to data portability">
        <p>
          You have the right to have data which we process based on your consent or in fulfillment
          of a contract automatically delivered to yourself or to a third party in a standard,
          machine-readable format. If you require the direct transfer of data to another responsible
          party, this will only be done to the extent technically feasible.
        </p>
      </Topic>

      <Topic title="Encrypted payments on this website">
        <p>
          If you enter into a contract which requires you to send us your payment information (e.g.
          account number for direct debits), we will require this data to process your payment.
        </p>
        <p>
          Payment transactions using common means of payment (Visa/MasterCard, direct debit) are
          only made via encrypted SSL or TLS connections. You can recognize an encrypted connection
          in your browser&apos;s address line when it changes from &ldquo;http://&rdquo; to
          &ldquo;https://&rdquo; and the lock icon in your browser line is visible.
        </p>
        <p>
          In the case of encrypted communication, any payment details you submit to us cannot be
          read by third parties.
        </p>
      </Topic>

      <Topic title="Information, blocking, deletion">
        <p>
          As permitted by law, you have the right to be provided at any time with information free
          of charge about any of your personal data that is stored as well as its origin, the
          recipient and the purpose for which it has been processed. You also have the right to have
          your data be corrected, blocked or deleted. You can contact us at any time using the
          address given in our legal notice if you have further questions on the topic of personal
          data.
        </p>
      </Topic>

      <Topic title="Opposition to promotional emails">
        <p>
          We hereby expressly prohibit the use of contact data published in the context of website
          legal notice requirements with regard to sending promotional and informational materials
          not expressly requested. The website operator reserves the right to take specific legal
          action if unsolicited advertising material, such as email spam, is received.
        </p>
      </Topic>
    </>
  );
}

function DataCollection() {
  return (
    <>
      <Topic title="Cookies">
        <p>
          Some of our web pages use cookies. Cookies do not harm your computer and do not contain
          any viruses. Cookies help make our website more user-friendly, efficient, and secure.
          Cookies are small text files that are stored on your computer and saved by your browser.
        </p>
        <p>
          Most of the cookies we use are so-called &ldquo;session cookies.&rdquo; They are
          automatically deleted after your visit. Other cookies remain in your device&apos;s memory
          until you delete them. These cookies make it possible to recognize your browser when you
          next visit the site.
        </p>
        <p>
          You can configure your browser to inform you about the use of cookies so that you can
          decide on a case-by-case basis whether to accept or reject a cookie. Alternatively, your
          browser can be configured to automatically accept cookies under certain conditions or to
          always reject them, or to automatically delete cookies when closing your browser.
          Disabling cookies may limit the functionality of this website.
        </p>
        <LegalBasis>
          Cookies which are necessary to allow electronic communications or to provide certain
          functions you wish to use (such as the shopping cart) are stored pursuant to Art. 6
          paragraph 1, letter f of the EU DSGVO/GDPR. The website operator has a legitimate interest
          in the storage of cookies to ensure an optimized service provided free of technical
          errors. If other cookies (such as those used to analyze your surfing behavior) are also
          stored, they will be treated separately in this privacy policy.
        </LegalBasis>
      </Topic>

      <Topic title="Server log files">
        <p>
          The website provider automatically collects and stores information that your browser
          automatically transmits to us in &ldquo;server log files&rdquo;. These are:
        </p>
        {/* Two columns from sm, with one rule across both under each row, and
            every row as tall as the tallest, since two labels wrap. */}
        <ul className="grid border-t border-rule sm:auto-rows-fr sm:grid-cols-2">
          {serverLogFields.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-rule py-3 text-base sm:pr-6"
            >
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem] shrink-0 text-ink-muted" />
              {label}
            </li>
          ))}
        </ul>
        <p>These data will not be combined with data from other sources.</p>
        <LegalBasis>
          The basis for data processing is Art. 6 (1) (f) of the EU DSGVO/GDPR, which allows the
          processing of data to fulfill a contract or for measures preliminary to a contract.
        </LegalBasis>
      </Topic>

      <Topic title="Contact form">
        <p>
          Should you send us questions via contact form on our website, we will collect the data
          entered on in the form, including the contact details you provide, to answer your
          question and any follow-up questions. We do not share this information without your
          permission.
        </p>
        <p>
          We will, therefore, process any data you enter in the contact form only with your consent
          per Art. 6 (1) (a) of the EU DSGVO/GDPR. You may revoke your consent at any time. An
          informal email making this request is sufficient. Data processed before we receive your
          request may still be legally processed.
        </p>
        <p>
          We will retain the data you provide in the contact form until you request its deletion,
          revoke your consent for its storage, or the purpose for its storage no longer pertains
          (e.g. after fulfilling your request). Any mandatory statutory provisions, especially those
          regarding mandatory data retention periods, remain unaffected by this provision.
        </p>
      </Topic>

      <Topic title="Processing of data (customer and contract data)">
        <p>
          We collect, process, and use personal data only insofar as it is necessary to establish,
          or modify legal relationships with us (master data). This is done based on Art. 6 (1) (b)
          of the EU DSGVO/GDPR, which allows the processing of data to fulfill a contract or for
          measures preliminary to a contract. We collect, process and use your personal data when
          accessing our website (usage data) only to the extent required to enable you to access our
          service or to bill you for the same.
        </p>
        <p>
          Collected customer data shall be deleted after completion of the order or termination of
          the business relationship. Legal retention periods remain unaffected.
        </p>
      </Topic>

      <Topic title="Data transmitted when entering into a contract with online shops, retailers, and mail order">
        <p>
          We transmit personally identifiable data to third parties only to the extent required to
          fulfill the terms of your contract, for example, to companies entrusted to deliver goods to
          your location or banks entrusted to process your payments. Your data will not be
          transmitted for any other purpose unless you have given your express permission to do so.
          Your data will not be disclosed to third parties for advertising purposes without your
          express consent.
        </p>
        <LegalBasis>
          The basis for data processing is Art. 6 (1) (b) of the EU DSGVO/GDPR, which allows the
          processing of data to fulfill a contract or for measures preliminary to a contract.
        </LegalBasis>
      </Topic>

      <Topic title="Data transferred when signing up for services and digital content">
        <p>
          We transmit personally identifiable data to third parties only to the extent required to
          fulfill the terms of your contract with us, for example, to banks entrusted to process
          your payments.
        </p>
        <p>
          Your data will not be transmitted for any other purpose unless you have given your express
          permission to do so. Your data will not be disclosed to third parties for advertising
          purposes without your express consent.
        </p>
        <LegalBasis>
          The basis for data processing is Art. 6 (1) (b) of the EU DSGVO/GDPR, which allows the
          processing of data to fulfill a contract or for measures preliminary to a contract.
        </LegalBasis>
      </Topic>
    </>
  );
}

function Analytics() {
  return (
    <Topic title="Matomo (formerly Piwik)">
      <p>
        This website uses the open source web analytics service Matomo. Matomo uses so-called
        &ldquo;cookies&rdquo;. These are text files that are stored on your computer and that allow
        an analysis of the use of the website by you. For this purpose, the information generated by
        the cookie about the use of this website is stored on our server. The IP address is
        anonymized before it is stored.
      </p>
      <p>Matomo cookies remain on your device until you delete them.</p>
      <LegalBasis>
        The storage of Matomo cookies is based on Art. 6 (1) (f) of the EU DSGVO/GDPR. The website
        operator has a legitimate interest in analyzing user behavior in order to optimize both its
        website and its advertising.
      </LegalBasis>
      <p>
        The information generated by the cookies about your use of this website will not be
        disclosed to third parties. You can prevent these cookies being stored by selecting the
        appropriate settings in your browser. However, we wish to point out that doing so may mean
        you will not be able to enjoy the full functionality of this website.
      </p>
      {/* "here" refers to a Matomo opt-out control, which is not on the site yet. */}
      <p>
        If you do not agree with the storage and use of your data, you can disable this feature
        here. In this case, an opt-out cookie will be stored in your browser to prevent Matomo from
        storing your usage data. If you delete your cookies, this will mean that the opt-out cookie
        will also be deleted. You will then need to reactivate it when you return to our site if you
        wish your activity not to be tracked.
      </p>
    </Topic>
  );
}

function Newsletter() {
  return (
    <Topic title="Newsletter data">
      <p>
        If you would like to receive our newsletter, we require a valid email address as well as
        information that allows us to verify that you are the owner of the specified email address
        and that you agree to receive this newsletter. No additional data is collected or is only
        collected on a voluntary basis. We only use this data to send the requested information and
        do not pass it on to third parties.
      </p>
      <p>
        We will, therefore, process any data you enter in the contact form only with your consent
        per Art. 6 (1) (a) of the EU DSGVO/GDPR. You can revoke consent to the storage of your data
        and email address as well as their use for sending the newsletter at any time, e.g. through
        the &ldquo;unsubscribe&rdquo; link in the newsletter. The data processed before we receive
        your request may still be legally processed.
      </p>
      <p>
        The data provided when registering for the newsletter will be used to distribute the
        newsletter until you cancel your subscription when said data will be deleted. Data we have
        stored for other purposes (e.g. email addresses for the members area) remain unaffected.
      </p>
    </Topic>
  );
}

const sections = [
  { id: "overview", title: "An overview of data protection", Body: Overview },
  { id: "general", title: "General information and mandatory information", Body: GeneralInformation },
  { id: "data-collection", title: "Data collection on our website", Body: DataCollection },
  { id: "analytics", title: "Analytics and advertising", Body: Analytics },
  { id: "newsletter", title: "Newsletter", Body: Newsletter },
];
