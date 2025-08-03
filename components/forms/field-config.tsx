import {
  AtSign,
  Barcode,
  Calendar,
  Clock,
  Hash,
  Link,
  Menu,
  Phone,
  Sliders,
} from "lucide-react";
import { ReactElement } from "react";

import { FieldType } from "@/firebase/types";

export const allFieldTypes = [
  "text",
  "textarea",
  "email",
  "number",
  "date",
  "time",
  "url",
  "slider",
  "phone",
] as const;

export const fieldTypeToLabel: Record<FieldType, string> = {
  text: "Short Answer",
  textarea: "Long Answer",
  email: "Email",
  url: "URL",
  number: "Number",
  phone: "Phone Number",
  date: "Date",
  time: "Time",
  slider: "Range",
};

export const fieldTypeToIcon: Record<FieldType, ReactElement> = {
  text: <Menu />,
  textarea: <Barcode className="rotate-90" />,
  email: <AtSign />,
  url: <Link />,
  number: <Hash />,
  phone: <Phone />,
  date: <Calendar />,
  time: <Clock />,
  slider: <Sliders />,
};
