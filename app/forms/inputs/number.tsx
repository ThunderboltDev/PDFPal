"use client";

import { ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import { fieldTypeToLabel } from "@/components/forms/field-config";
import { InputRendererPropsWithErrorHandling } from "../components/field-renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage, validateField } from "../components/validation";

export default function NumberInput({
  field,
  response,
  update,
  error,
  setError,
}: InputRendererPropsWithErrorHandling) {
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const err = validateField(field, value);

    setError(err || null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    update(field.id, e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+", "-"];
    if (
      field.flags?.allowScientificNotation === false &&
      invalidChars.includes(e.key)
    )
      e.preventDefault();
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
      <Input
        type="text"
        inputMode="numeric"
        id={field.id}
        name={field.id}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={(response.answers[field.id] as string) || ""}
        placeholder={field.placeholder ?? fieldTypeToLabel[field.type]}
        required={field.required}
        aria-invalid={!!error}
      />
      <ErrorMessage error={error} />
    </div>
  );
}
