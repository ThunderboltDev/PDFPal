"use client";

import { InputRendererPropsWithErrorHandling } from "../components/field-renderer";
import { Label } from "@/components/ui/label";
import { Date } from "@/components/ui/date";
import { ErrorMessage, validateField } from "../components/validation";

export default function DateInput({
  field,
  response,
  update,
  error,
  setError,
}: InputRendererPropsWithErrorHandling) {
  const handleBlur = (date: string) => {
    console.log(`blur: "${date}"`);
    const err = validateField(field, date);

    setError(err || null);
  };

  const handleChange = (date: Date) => {
    if (error) setError(null);
    update(field.id, date.toDateString());
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
      <Date
        id={field.id}
        value={response.answers[field.id] as string}
        placeholder={field.placeholder ?? "Date"}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={field.dateDisabled}
        ariaInvalid={!!error}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
