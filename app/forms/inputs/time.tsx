"use client";

import { InputRendererPropsWithErrorHandling } from "../components/field-renderer";
import { Label } from "@/components/ui/label";
import Time from "@/components/ui/time";
import { ErrorMessage, validateField } from "../components/validation";
import { useState } from "react";

type ErrorSource = "h" | "m" | "period";

export default function TimeInput({
  field,
  response,
  update,
  error,
  setError,
}: InputRendererPropsWithErrorHandling) {
  const [errorSource, setErrorSource] = useState<ErrorSource | null>(null);

  const handleBlur = (value: string, source: ErrorSource) => {
    const err = validateField(field, value);
    setErrorSource(source);
    setError(err || null);
  };

  const handleChange = (value: string) => {
    if (error) setError(null);
    update(field.id, value);
  };

  return (
    <div>
      <Label
        htmlFor={field.id}
        required={field.required}
        className="mb-2"
      >
        {field.label}
      </Label>
      <Time
        id={field.id}
        required={field.required}
        value={response.answers[field.id] as string}
        is24HourFormat={field.flags?.["is24HourFormat"]}
        onValueChange={handleChange}
        onBlur={handleBlur}
        timeInvalid={!!error && errorSource !== "period"}
        periodInvalid={!!error && errorSource === "period"}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
