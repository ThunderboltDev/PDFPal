import withAuth, { type PropsWithNullableDbUser } from "@/hoc/with-auth";
import Plans from "./plans";

function Pricing({ dbUser }: PropsWithNullableDbUser) {
  return (
    <div className="mb-8 mt-24 text-center container-5xl">
      <h1>Pricing</h1>
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
