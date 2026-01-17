import type { Metadata } from "next";
import Account from "./account";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Manage your PDF Pal account, view subscription details, see account information, and update your personal information securely!",
  keywords: [
    "PDF Pal account",
    "PDF Pal user",
    "PDF Pal account information",
    "PDF Pal user information",
    "PDF Pal update account",
    "PDF Pal delete account",
    "PDF Pal view subscription",
  ],
};

export default async function AccountWrapper() {
  return <Account />;
}
