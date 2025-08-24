"use client";

import { InputRendererProps } from "../components/field-renderer";
import { Label } from "@/components/ui/label";
import { Date } from "@/components/ui/date";

export default function DateInput({
  field,
  response,
  update,
}: InputRendererProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={field.id}
        required={field.required}
      >
        {field.label}
      </Label>
      <Date
        id={field.id}
        value={(response.answers[field.id] as string) || ""}
        placeholder={field.placeholder}
        onChange={(date: Date) => {
          update(field.id, date.toDateString());
        }}
        disabled={field.dateDisabled}
      />
    </div>
  );
}
