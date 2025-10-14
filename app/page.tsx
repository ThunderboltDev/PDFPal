import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Hero from "@/components/landing-page/hero";
import Steps from "@/components/landing-page/steps";

export default function Home() {
	return (
		<>
			<Hero />
			<Features />
			<Steps />
			<FAQ />
		</>
	);
}
