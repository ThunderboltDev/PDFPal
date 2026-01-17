import type { Metadata } from "next";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your PDFs, chat with AI, summarise documents, and get valuable insights instantly!",
  keywords: [
    "PDF Pal dashboard",
    "PDF AI tools",
    "chat with PDF",
    "PDF summarizer",
    "PDF management",
    "AI PDF workspace",
  ],
};

export default async function DashboardWrapper() {
  return <Dashboard />;
}
