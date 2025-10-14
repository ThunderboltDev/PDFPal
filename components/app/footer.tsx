"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaDiscord, FaGithub } from "react-icons/fa";
import config from "@/config";

const currentYear = new Date().getFullYear();

export default function Footer() {
	const pathname = usePathname();

	const includedPaths = [
		"/",
		"/pricing",
		"/billing",
		"/contact",
		"/faq",
		"/cookie-policy",
		"/privacy-policy",
		"/terms-of-service",
	];
	if (!includedPaths.includes(pathname)) return null;

	return (
		<footer className="mt-16 bg-secondary shadow-2xl">
			<div className="mx-auto max-w-6xl p-6">
				<div className="flex flex-col items-center justify-evenly gap-3 md:flex-row">
					<h4 className="text-center text-secondary-foreground">
						{config.name}
					</h4>
					<ul className="grid list-none grid-cols-2 gap-3 p-0 text-center text-sm md:flex md:flex-row md:gap-10">
						<li>
							<Link className="text-secondary-foreground" href="/billing">
								Billing
							</Link>
						</li>
						<li>
							<Link className="text-secondary-foreground" href="/pricing">
								Pricing
							</Link>
						</li>
						<li>
							<Link className="text-secondary-foreground" href="/faq">
								FAQ
							</Link>
						</li>
						<li>
							<Link className="text-secondary-foreground" href="/contact">
								Contact
							</Link>
						</li>
						<li>
							<Link
								className="text-secondary-foreground"
								href="/privacy-policy"
							>
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link
								className="text-secondary-foreground"
								href="/terms-of-service"
							>
								Terms of Service
							</Link>
						</li>
					</ul>
				</div>
				<div className="mt-6 flex flex-col items-center justify-around gap-4 border-t pt-6 text-muted-foreground text-sm md:flex-row">
					<span>
						© {currentYear} {config.name}. All rights reserved.
					</span>
					<div className="flex gap-8">
						<Link
							aria-label="Discord"
							href={config.socials.discord}
							target="_blank"
						>
							<span className="sr-only">Discord</span>
							<FaDiscord className="size-8 text-[#5865F2] transition-transform duration-250 ease-out hover:scale-110" />
						</Link>
						<Link
							aria-label="GitHub"
							href={config.socials.github}
							target="_blank"
						>
							<span className="sr-only">GitHub</span>
							<FaGithub className="size-8 text-[#24292e] transition-transform duration-250 ease-out hover:scale-110" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
