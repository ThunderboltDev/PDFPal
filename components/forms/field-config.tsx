import { AtSign, Barcode, Hash, Menu, Sliders, ToggleLeft } from "lucide-react";
import { ReactElement } from "react";
import { FieldType } from "@/firebase/types";

export const fieldTypeToLabel: Record<FieldType, string> = {
  text: "Short Answer",
  textarea: "Long Answer",
  email: "Email",
  number: "Number",
  select: "Select",
  switch: "Switch",
};

export const fieldTypeToIcon: Record<FieldType, ReactElement> = {
  text: <Menu />,
  textarea: <Barcode className="rotate-90" />,
  email: <AtSign />,
  number: <Hash />,
  select: <Sliders />,
  switch: <ToggleLeft />,
};
