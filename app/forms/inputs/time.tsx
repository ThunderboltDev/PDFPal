"use client";

import { InputRendererProps } from "../components/field-renderer";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Time from "@/components/ui/time";

export default function TimeInput({
  field,
  response,
  update,
}: InputRendererProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    if (error) setError(null);
    update(field.id, value);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={field.id}
        required={field.required}
      >
        {field.label}
      </Label>
      <Time
        id={field.id}
        required={field.required}
        value={
          (response.answers[field.id] as `${string}:${string} ${
            | "AM"
            | "PM"}`) ?? "11:30 PM"
        }
        is24HourFormat={field.flags?.["is24HourFormat"]}
        onValueChange={handleChange}
      />
    </div>
  );
}
