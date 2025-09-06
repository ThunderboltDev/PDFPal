import withAuth, { type PropsWithNullableDbUser } from "@/hoc/with-auth";
import Plans from "./plans";
import Link from "next/link";

function Pricing({ dbUser }: PropsWithNullableDbUser) {
  return (
    <div className="mb-16 mt-24 px-2 sm:px-4 container-5xl">
      <h1>Pricing</h1>
      <Link href="#free-plan">FRe</Link>
      <Link href="#pro-plan">pro</Link>
      <p className="mt-5 text-muted-foreground sm:text-lg">
        Whether you&apos;re just trying out our service or need more, we&apos;ve
        got you covered!
      </p>
      <Plans dbUser={dbUser} />
    </div>
  );
}

export default withAuth(Pricing, {
  allowUnauthenticated: true,
  origin: "/pricing",
});
