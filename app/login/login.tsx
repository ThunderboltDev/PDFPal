"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

export default function LoginPage() {
  return (
    <div className="container-5xl flex flex-col space-y-3">
      <h2>Welcome back</h2>
      <LoginLink
        authUrlParams={{
          connection_id: process.env.KINDE_GOOGLE_CONNECTION_ID!,
        }}
      >
        l
      </LoginLink>
    </div>
  );
}
