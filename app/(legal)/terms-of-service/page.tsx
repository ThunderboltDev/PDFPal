import type { Metadata } from "next";
import Link from "next/link";
import config from "@/config";

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"Read the Terms of Service to understand your rights and responsibilities when using our platform!",
};

export default function TermsOfService() {
	return (
		<main className="container-3xl mt-20">
			<section>
				<h1>Terms of Service</h1>
				<p className="font-medium">Last updated October 05, 2025</p>
				<p>
					These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
					{config.name}
					(&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) and our website (
					<Link href={config.url}>{config.url}</Link>). By accessing or using
					our Service, you agree to be bound by these Terms. If you do not
					agree, please do not use the Service.
				</p>
			</section>
			<section>
				<h3>User Accounts</h3>
				<p>
					To use certain features of the Service, you may be required to create
					an account. You are responsible for maintaining the confidentiality of
					your account credentials and for all activities that occur under your
					account.
				</p>
				<p>
					You must provide accurate and complete information to register for an
					account to use our Service. You may not share your account credentials
					or make your account available to anyone else and are responsible for
					all activities that occur under your account.
				</p>
			</section>
			<section>
				<h3>Acceptable Use</h3>
				<p>
					You agree not to use the Service for any unlawful purpose, or in a way
					that could damage, disable, overburden, or impair the Service. You may
					not attempt to gain unauthorized access to any portion of the Service
					or other accounts, computer systems, or networks connected to the
					Service. You may not use our Service for any illegal, harmful, or
					abusive activity. For example, you may not:
				</p>
				<ul>
					<li>
						Use our Service in a way that infringes, misappropriates or violates
						anyone&apos;s rights.
					</li>
					<li>Represent that Output was human-generated when it was not.</li>
					<li>
						Interfere with or disrupt our Service, including circumvent any rate
						limits or restrictions or bypass any protective measures or safety
						mitigations we put on our Service.
					</li>
				</ul>
			</section>
			<section>
				<h3>Free and Pro Plans</h3>
				<p>
					{config.name} operates on a freemium model. The Free plan allows
					access to limited features, while the Pro plan provides additional
					features for a subscription fee. Payments for Pro plans are
					non-refundable. You can manage your subscription by going to the{" "}
					<Link href="/billing">Billing Page</Link>.
				</p>
			</section>
			<section>
				<h3>Payments and Billing</h3>
				<p>
					Payments for Pro subscriptions are processed through our third-party
					payment provider (<Link href="https://creem.io">Creem</Link>). By
					subscribing, you authorize us to charge the selected payment method
					for the subscription fee on a recurring basis.
				</p>
				<p>
					If you purchase anything, you must provide complete and accurate
					billing information, including a valid payment method. For paid
					subscriptions, we will automatically charge your payment method on
					each agreed-upon periodic renewal until you cancel. You&apos;re
					responsible for all applicable taxes, and we&apos;ll charge tax when
					required. If your payment cannot be completed, we may downgrade your
					account or suspend your access to our Services until payment is
					received.
				</p>
				<p>
					You can <Link href="/billing">cancel your paid subscription</Link> at
					any time. Payments are non-refundable, except where required by law.
					These Terms do not override any mandatory local laws regarding your
					cancellation rights.
				</p>
			</section>
			<section>
				<h3>Content</h3>
				<p>
					You retain ownership of any content you submit to the Service. By
					submitting content, you grant {config.name} a limited, non-exclusive,
					royalty-free license to use, display, and distribute the content for
					the purposes of operating and improving the Service.
				</p>
				<p>
					We may use Content to provide, maintain, develop, and improve our
					Service, comply with applicable law, enforce our terms and policies,
					and keep our Service safe.
				</p>
			</section>
			<section>
				<h3>Termination</h3>
				<p>
					You are free to stop using our Services at any time. We reserve the
					right to suspend or terminate your account at any time if we
					determine:
				</p>
				<ul>
					<li>You breached these Terms</li>
					<li>We must do so to comply with the law</li>
					<li>
						Your use of our Service could cause risk or harm to us, our users,
						or anyone else
					</li>
				</ul>
				<p>
					We also may terminate your account if it has been inactive for over 90
					days and you do not have a paid account. If we do, we will provide you
					with advance notice.
				</p>
			</section>
			<section>
				<h3>Disclaimer</h3>
				<p>
					The Service is provided &quot;as is&quot; and &quot;as available&quot;
					without warranties of any kind, either express or implied.{" "}
					{config.name} will not be liable for any indirect, incidental,
					special, or consequential damages arising from your use of the
					Service.
				</p>
				<p>
					The Service uses AI to assist with answering questions and
					summarizing. AI generated content maybe inaccurate or unreliable.
					Users should verify important information independently. We make no
					guarantees regarding the accuracy, reliability, or availability of the
					Service. You use the Service at your own risk. We are noy responsible
					for errors or misuse of AI generated content.
				</p>
			</section>
			<section>
				<h3>Changes to Terms</h3>
				<p>
					We may modify these Terms at any time. Updated Terms will be posted on
					the Service with a new &quot;Last updated&quot; date. Continued use of
					the Service after changes constitutes your acceptance of the updated
					Terms.
				</p>
			</section>
			<section>
				<h3>Contact Us</h3>
				<p>
					If you have any questions regarding these Terms, please contact us at:{" "}
					<Link href={`mailto:${config.socials.email}`}>
						{config.socials.email}
					</Link>
					.
				</p>
			</section>
		</main>
	);
}
