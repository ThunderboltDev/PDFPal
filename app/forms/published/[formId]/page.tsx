"use client";

import dynamic from "next/dynamic";
const PublishedForm = dynamic(() => import("./form"), { ssr: false });
export default PublishedForm;
