import config from "config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "We respect your privacy. Learn how we collect, use and store your personal information when you use our website.",
  keywords: ["PDF Pal privacy", "PDF Pal policy", "PDF Pal privacy policy"],
};

export default function PrivacyPolicy() {
  return (
    <main className="container-3xl mt-20">
      <section>
        <h1>Privacy Policy</h1>
        <p className="font-medium">Last updated October 05, 2025</p>
        <p>
          This Privacy Policy describes how {config.name}, collects, uses, and
          discloses your information when you use our website (
          <Link href={config.url}>{config.url}</Link>). (the
          &quot;Service&quot;). By accessing or using the Service, you are
          consenting to the collection, use and disclosure of your information
          in accordance with this Privacy Policy. If you do not consent to the
          same, please do not access or use the Service.
        </p>
        <p>
          We may modify this Privacy Policy at any time without any prior notice
          to you and will post the revised Privacy Policy on the Service. The
          revised Policy will be effective immediately when the revised Policy
          is posted in the Service and your continued access or use of the
          Service after such time will constitute your acceptance of the revised
          Privacy Policy. We therefore recommend that you periodically review
          this page.
        </p>
      </section>
      <section>
        <h3>Information Collection and Use</h3>
        <p>
          We will collect and process the following personal information about
          you:
        </p>
        <ul>
          <li>username</li>
          <li>email</li>
          <li>profile picture </li>
          <li>payment info</li>
        </ul>
        <p>
          We do not collect precise location information. However, analytics
          tools such as Google Analytics may collect approximate location (like
          city or country) based on IP address for aggregated insights.
        </p>
      </section>
      <section>
        <h3> How we collect your information</h3>
        <p>We collect/receive information about you in the following manner:</p>
        <ul>
          <li>
            when a user submits a registration form or otherwise submit personal
            information
          </li>
          <li>interacts with the website</li>
        </ul>
      </section>
      <section>
        <h3>How we use your information</h3>
        <p>
          We will use the information that we collect about you for the
          following purposes:
        </p>
        <ul>
          <li>creating user account</li>
          <li>customer feedback collection</li>
          <li>processing payment</li>
          <li>site protection</li>
          <li>manage user account</li>
        </ul>
        <p>
          If we want to use your information for any other purpose, we will ask
          you for consent and will use your information only on receiving your
          consent and then, only for the purpose(s) for which grant consent
          unless we are required to do otherwise by law.
        </p>
      </section>
      <section>
        <h3>How we share your information</h3>
        <p>
          We will not transfer your personal information to any third party
          without seeking your consent, except in limited circumstances as
          described below:
        </p>
        <ul>
          <li>Google Analytics</li>
        </ul>
        <p>
          We require such third parties to use the personal information we
          transfer to them only for the purpose for which it was transferred and
          not to retain it for longer than is required for fulfilling the said
          purpose.
        </p>
        <p>
          We may also disclose your personal information for the following: (1)
          to comply with applicable law, regulation, court order or other legal
          process; (2) to enforce your agreements with us, including this
          Privacy Policy; or (3) to respond to claims that your use of the
          Service violates any third-party rights. If the Service or our company
          is merged or acquired with another company, your information will be
          one of the assets that is transferred to the new owner.
        </p>
      </section>
      <section>
        <h3>AI Generated Content</h3>
        <p>
          We use AI to assist with answering questions and summarizing PDFs. The
          AI may generate content that is inaccurate, misleading or unreliable.
          Users should independently verify important information and not rely
          on AI generated content. By using the AI features, you acknowledge and
          accept these limitations.
        </p>
      </section>
      <section>
        <h3>Data Processed by AI</h3>
        <p>
          Any content you submit to the AI assistant is processed temporarily to
          generate responses. We do not share your data or use it to train AI
          models beyond what is necessary for providing the service. We do not
          use your documents to train AI models.
        </p>
      </section>
      <section>
        <h3>Data Retention Policy</h3>
        <p>
          We will retain your personal information with us for 90 days to 2
          years after user accounts remain idle or for as long as we need it to
          fulfill the purposes for which it was collected as detailed in this
          Privacy Policy. We may need to retain certain information for longer
          periods such as record-keeping / reporting in accordance with
          applicable law or for other legitimate reasons like enforcement of
          legal rights, fraud prevention, etc. Residual anonymous information
          and aggregate information, neither of which identifies you (directly
          or indirectly), may be stored indefinitely.
        </p>
      </section>
      <section>
        <h3>Your rights</h3>
        <p>
          Depending on the law that applies, you may have a right to access and
          rectify or erase your personal data or receive a copy of your personal
          data, restrict or object to the active processing of your data, ask us
          to share (port) your personal information to another entity, withdraw
          any consent you provided to us to process your data, a right to lodge
          a complaint with a statutory authority and such other rights as may be
          relevant under applicable laws. To exercise these rights, you can
          write to us at{" "}
          <Link href={`mailto:${config.socials.email}`}>
            {config.socials.email}
          </Link>
          . We will respond to your request in accordance with applicable law.
        </p>
        <p>
          Do note that if you do not allow us to collect or process the required
          personal information or withdraw the consent to process the same for
          the required purposes, you may not be able to access or use the
          services for which your information was sought.
        </p>
      </section>
      <section>
        <h3>Cookies</h3>
        <p>
          To learn more about how we use these and your choices in relation to
          these tracking technologies, please refer to our{" "}
          <Link href={`${config.url}/cookie-policy`}> Cookie Policy</Link>.
        </p>
      </section>
      <section>
        <h3>Security</h3>
        <p>
          The security of your information is important to us and we will use
          reasonable security measures to prevent the loss, misuse or
          unauthorized alteration of your information under our control.
          However, given the inherent risks, we cannot guarantee absolute
          security and consequently, we cannot ensure or warrant the security of
          any information you transmit to us and you do so at your own risk.
        </p>
      </section>
      <section>
        <h3>Third party links &amp; use of your information</h3>
        <p>
          Our Service may contain links to other websites that are not operated
          by us. This Privacy Policy does not address the privacy policy and
          other practices of any third parties, including any third party
          operating any website or service that may be accessible via a link on
          the Service. We strongly advise you to review the privacy policy of
          every site you visit. We have no control over and assume no
          responsibility for the content, privacy policies or practices of any
          third party sites or services.
        </p>
      </section>
      <section>
        <h3>Contact Us</h3>
        <p>
          If you have any questions regarding privacy while using the Service,
          or have questions about the practices, please contact us at:{" "}
          <Link href={`mailto:${config.socials.email}`}>
            {config.socials.email}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
