import Link from "next/link";
import {
  Building2,
  ChartColumn,
  Clock,
  Database,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CutTitle, Enter } from "@/components/ui/enter";
import { Reveal } from "@/components/ui/reveal";
import { ScrollLink } from "@/components/ui/scroll-link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Metal Werx collects, uses and protects your personal data when you visit or use our website.",
};

export default function PrivacyPolicyPage() {
  // <main> takes in the header, so the h1 is part of the main content and the
  // header isn't read as a second site banner.
  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <header className="relative overflow-hidden bg-linear-to-br from-cherry-dark via-ember to-clinker">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_24px,rgb(255_255_255/0.04)_24px_48px)]"
        />
        <ShieldCheck
          aria-hidden="true"
          strokeWidth={1.25}
          className="absolute -right-16 -bottom-24 hidden size-[28rem] rotate-12 text-white/10 sm:block"
        />
        {/* Plays on load, one step after another (see components/ui/enter.jsx). */}
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
          <Enter
            as="p"
            step={0}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-oswald text-xs uppercase tracking-[0.3em] text-white ring-1 ring-white/25"
          >
            <Lock aria-hidden="true" className="size-3.5" />
            Legal
          </Enter>
          <h1 className="mt-5 font-bebas-neue text-7xl tracking-wide text-white sm:text-8xl">
            <CutTitle step={1}>Privacy Policy</CutTitle>
          </h1>
          <Enter step={2} className="mt-4 h-1 w-16 bg-white" />
          <Enter as="p" step={2} className="mt-8 max-w-2xl text-lg leading-8 text-chrome">
            What personal information we collect when you visit or use our website, why we collect
            it, and how we handle it.
          </Enter>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
        <nav
          aria-label="On this page"
          className="rounded-2xl border border-line border-t-4 border-t-cherry bg-panel p-5 lg:sticky lg:top-8 lg:self-start"
        >
          <p className="px-2 font-oswald text-xs uppercase tracking-[0.3em] text-ink-muted">
            On this page
          </p>
          {/* The links slide in one by one, like the Contact page's, and ease
              the page down to their section. */}
          <ol className="mt-4 space-y-1">
            {sections.map(({ id, title, icon: Icon }, i) => (
              <Reveal as="li" key={id} variant="slide" step={i}>
                <ScrollLink
                  href={`#${id}`}
                  title={title}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 text-sm leading-5 text-ink-soft transition-colors hover:bg-oxblood hover:text-white focus-visible:bg-oxblood focus-visible:text-white focus-visible:outline-none"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-cherry/15 text-ink-cherry transition-colors group-hover:bg-cherry group-hover:text-white group-focus-visible:bg-cherry group-focus-visible:text-white">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  {title}
                </ScrollLink>
              </Reveal>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-12 lg:mt-0">
          {sections.map(({ id, title, icon: Icon, Body }, i) => (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
              className="scroll-mt-8 overflow-hidden rounded-2xl border border-line bg-panel"
            >
              <div className="flex items-center gap-5 border-b-2 border-cherry bg-linear-to-r from-oxblood to-panel light:from-cherry/10 px-6 py-6 sm:px-8">
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-cherry text-white shadow-lg shadow-cherry/30">
                  <Icon aria-hidden="true" className="size-7" />
                </span>
                <div>
                  <p className="font-oswald text-xs uppercase tracking-[0.3em] text-ink-soft">
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
                <Body />
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-cherry">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <Reveal>
            <h2 className="font-bebas-neue text-4xl tracking-wide text-white sm:text-5xl">
              Questions about your data?
            </h2>
            <p className="mt-2 text-chrome">
              Get in touch about any request to see, correct or delete your personal information.
            </p>
          </Reveal>
          <Reveal step={1}>
            <Button
              asChild
              size="lg"
              className="bg-white font-oswald uppercase tracking-[0.15em] text-cherry hover:bg-chrome"
            >
              <Link href="/contact-us" title="Contact Us">
                Contact Us
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// 20px semibold counts as large text, so ink-cherry on the panel meets WCAG
// AA contrast here.
function Topic({ title, children }) {
  return (
    <div>
      <h3 className="font-oswald text-xl font-semibold uppercase tracking-[0.12em] text-ink-cherry">
        {title}
      </h3>
      <div className="mt-4 space-y-4 leading-7 text-ink-soft">{children}</div>
    </div>
  );
}

function QA({ question, children }) {
  return (
    <div className="rounded-xl border-l-4 border-cherry bg-well p-5">
      <h4 className="font-semibold text-ink">{question}</h4>
      <div className="mt-3 space-y-3 text-sm leading-6 text-ink-soft">{children}</div>
    </div>
  );
}

function Callout({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-iron-oxide bg-oxblood/60 p-5 text-ink light:border-cherry/25 light:bg-cherry/5">
      <p className="inline-flex items-center gap-2 rounded-full bg-cherry px-3 py-1 font-oswald text-xs uppercase tracking-[0.25em] text-white">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </p>
      <p className="mt-3 leading-7">{children}</p>
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

      <Topic title="Data collection on our website">
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
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
        <address className="flex items-center gap-4 rounded-xl bg-linear-to-r from-cherry to-cherry-dark p-5 font-semibold not-italic text-white">
          <Building2 aria-hidden="true" className="size-6 shrink-0" />
          Metal Werx Scrap Metal Recycling
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
        <ul className="grid gap-3 sm:grid-cols-2">
          {serverLogFields.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-lg bg-well px-4 py-3 text-sm text-ink"
            >
              <Icon aria-hidden="true" className="size-5 shrink-0 text-ink-cherry" />
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
  { id: "overview", title: "An overview of data protection", icon: ShieldCheck, Body: Overview },
  {
    id: "general",
    title: "General information and mandatory information",
    icon: Info,
    Body: GeneralInformation,
  },
  { id: "data-collection", title: "Data collection on our website", icon: Database, Body: DataCollection },
  { id: "analytics", title: "Analytics and advertising", icon: ChartColumn, Body: Analytics },
  { id: "newsletter", title: "Newsletter", icon: Mail, Body: Newsletter },
];
