import { allFieldTypes } from "@/components/forms/field-config";
import type { User as FirebaseUser } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";
import { DayPickerProps } from "react-day-picker";

export type User = FirebaseUser;

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string;
  avatar: string | null;
  isAnonymous: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  formsCreated?: number;
}

export type FieldType = (typeof allFieldTypes)[number];

export interface Field {
  id: string;
  order: number;
  type: FieldType;
  label: string;
  placeholder: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  step?: number;
  dateDisabled?: DayPickerProps["disabled"];
  options?: { name: string; value: string }[];
  flags?: Record<string, boolean>;
}

export interface LocalForm {
  id: string;
  title: string;
  description: string;
  responses?: number;
  fields: Field[];
  settings?: { themeColor?: string; isPublic?: boolean };
}

export interface Form extends LocalForm {
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LocalFormResponse {
  id: string;
  hasSubmitted?: boolean;
  answers: Record<string, string | number | boolean | null>;
}

export interface FormResponse extends Omit<LocalFormResponse, "hasSubmitted"> {
  respondentId?: string;
  submittedAt: Timestamp;
}
