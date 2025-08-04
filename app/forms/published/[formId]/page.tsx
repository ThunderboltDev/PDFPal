"use client";

import dynamic from "next/dynamic";
const PublishedForm = dynamic(() => import("./published"), { ssr: false });
export default PublishedForm;
