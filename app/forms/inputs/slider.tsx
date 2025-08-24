"use client";

import { InputRendererProps } from "../components/field-renderer";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderInput({
  field,
  response,
  update,
}: InputRendererProps) {
  const rawAnswer = response.answers[field.id];
  const parsedAnswer = Number(rawAnswer);
  const defaultValue = Number.isNaN(parsedAnswer)
    ? Number(field.placeholder) || 0
    : parsedAnswer;

  return (
    <div className="space-y-4">
      <Label
        htmlFor={field.id}
        required={field.required}
      >
        {field.label}
      </Label>
      <Slider
        defaultValue={[defaultValue]}
        min={Number(field.min ?? 0)}
        max={Number(field.max ?? 100)}
        step={Number(field.step ?? 1)}
        onValueChange={(values) => {
          update(field.id, values[0]);
        }}
      />
    </div>
  );
}
