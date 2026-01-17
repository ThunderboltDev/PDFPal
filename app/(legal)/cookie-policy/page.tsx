import { config } from "config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how PDF Pal use cookies to enhance your experience, manage sessions and improve website performance. Understand what cookies are set, their purpose and how you can manage them!",
  keywords: ["PDF Pal cookies", "PDF Pal cookie policy", "PDF Pal policy"],
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicy() {
  return (
    <main className="container-3xl mt-20">
      <section>
        <h1>Cookie Policy</h1>
        <p className="my-3 font-medium">Last updated October 05, 2025</p>
        <p>
          This Cookie Policy explains how {config.name} (&quot;we,&quot;
          &quot;our,&quot; or &quot;us&quot;) uses cookies and similar
          technologies on our website (
          <Link href={config.url}>{config.url}</Link>) to provide, improve, and
          analyze our services.
        </p>
      </section>
      <section>
        <h3>What are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They can help websites remember details about your visit,
          such as preferences or when you logged in. Cookies set directly by us
          are called first-party cookies. We also use third-party cookies, which
          originate from a domain different from the one you are currently
          visiting. Similar technologies, such as web beacons, sharing of device
          IDs and other identifiers via APIs or local storage, can also be used
          for these purposes. For simplicity, we will refer to these
          technologies as “cookies” in this Cookie Policy.
        </p>
      </section>
      <section>
        <h3>Types of Cookies We Use</h3>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the basic
            functionality of the website, such as account login and security.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Used to understand how users
            interact with the website. We use Google Analytics to collect
            aggregated, anonymized data such as number of visitors, pages
            visited, and general location (city/country based on IP). This helps
            us improve the Service.
          </li>
        </ul>
      </section>
      <section>
        <h3>Third-Party Cookies</h3>
        <p>
          Our website may use cookies from third-party services, such as Google
          Analytics. These cookies are used solely to measure usage statistics
          and improve our website. We do not share personally identifiable
          information through these cookies.
        </p>
      </section>
      <section>
        <h3>Managing Cookies</h3>
        <p>
          Your web browser may allow you to manage your cookie preferences,
          including to delete or disable cookies at any time. Please note that
          some features of the Service may not function properly if cookies are
          disabled. You can take a look at the help section of your web browser
          or follow the links below to understand your options.
        </p>
        <ul>
          <li>
            <Link
              href="https://support.google.com/chrome/answer/95647?hl=en%E2%81%A0%E2%81%A0"
              rel="noopener noreferrer"
              target="_blank"
            >
              Chrome
            </Link>
          </li>
          <li>
            <Link
              href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies%E2%81%A0%E2%81%A0"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explorer
            </Link>
          </li>
          <li>
            <Link
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              rel="noopener noreferrer"
              target="_blank"
            >
              Safari
            </Link>
          </li>
          <li>
            <Link
              href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
              rel="noopener noreferrer"
              target="_blank"
            >
              Firefox
            </Link>
          </li>
          <li>
            <Link
              href="https://help.opera.com/en/latest/web-preferences/#cookies%E2%81%A0%E2%81%A0"
              rel="noopener noreferrer"
              target="_blank"
            >
              Opera
            </Link>
          </li>
        </ul>
        <p>
          Please note that changes you make to your cookie settings will affect
          the functionality of the Service. Cookies settings are device and
          brower specific, so you will need to set cookie preferences for each
          deivce&apos;s browser.
        </p>
      </section>
      <section>
        <h3>Additional Information</h3>
        <p>
          To learn more about how cookies work and your options, including how
          to see what cookies have been set on your device and how to manage and
          delete them, please visit{" "}
          <Link
            href="https://www.allaboutcookies.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            All About Cookies
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.youronlinechoices.eu/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Your Online Choices
          </Link>
          .
        </p>
      </section>
      <section>
        <h3>Contact Us</h3>
        <p>
          If you have any questions about this Cookie Policy, please contact us
          at:{" "}
          <Link href={`mailto:${config.socials.email}`}>
            {config.socials.email}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
