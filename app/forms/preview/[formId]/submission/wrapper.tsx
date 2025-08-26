"use client";

import { useParams } from "next/navigation";
import PreviewNavbar from "../navbar";
import PreviewSummary from "./summary";
import PreviewResponseActions from "./actions";

export default function PreviewSubmissionWrapper() {
  const { formId } = useParams();

  return (
    <>
      <PreviewNavbar formId={formId as string} />
      <PreviewSummary />
      <PreviewResponseActions />
    </>
  );
}
