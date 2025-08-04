"use client";

import dynamic from "next/dynamic";
const FormSettings = dynamic(() => import("./settings"), { ssr: false });
export default FormSettings;
