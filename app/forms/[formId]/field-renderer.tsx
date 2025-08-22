import { ChangeEvent } from "react";

import { fieldTypeToLabel } from "@/components/forms/field-config";
import { Input } from "@/components/ui/input";
import { Field, DraftFormResponse } from "@/firebase/types";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Date } from "@/components/ui/date";
import Time from "@/components/ui/time";
import TextInput from "../fields/text";

export interface InputRendererProps {
  field: Field;
  response: DraftFormResponse;
  update: (fieldId: string, newValue: string | number | boolean | null) => void;
}

export default function RenderField({
  field,
  response,
  update,
}: InputRendererProps) {
  switch (field.type) {
    case "text": {
      return (
        <TextInput
          field={field}
          response={response}
          update={update}
        />
      );
    }
    case "email": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type="email"
            autoComplete="email"
            value={response.answers[field.id] as string}
            placeholder={field.placeholder || fieldTypeToLabel[field.type]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              update(field.id, e.target.value);
            }}
          />
        </div>
      );
    }
    case "url": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type="url"
            value={response.answers[field.id] as string}
            placeholder={field.placeholder || fieldTypeToLabel[field.type]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              update(field.id, e.target.value);
            }}
          />
        </div>
      );
    }
    case "number": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type="number"
            value={response.answers[field.id] as string}
            placeholder={field.placeholder || fieldTypeToLabel[field.type]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              update(field.id, e.target.value);
            }}
          />
        </div>
      );
    }
    case "phone": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type="tel"
            autoComplete="tel"
            value={response.answers[field.id] as string}
            placeholder={field.placeholder || fieldTypeToLabel[field.type]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              update(field.id, e.target.value);
            }}
          />
        </div>
      );
    }
    case "date": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Date
            value={response.answers[field.id] as string}
            placeholder={field.placeholder}
            onChange={(date: Date) => {
              update(field.id, date.toDateString());
            }}
          />
        </div>
      );
    }
    case "time": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Time
            id={field.id}
            value={
              (response.answers[field.id] as `${string}:${string} ${
                | "AM"
                | "PM"}`) ?? "11:30 PM"
            }
            onValueChange={(value: string) => update(field.id, value)}
          />
        </div>
      );
    }
    case "textarea": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Textarea
            id={field.id}
            value={response.answers[field.id] as string}
            placeholder={field.placeholder || fieldTypeToLabel[field.type]}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              update(field.id, e.target.value);
            }}
          />
        </div>
      );
    }
    case "slider": {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Slider
            className="mt-2"
            defaultValue={[
              Number(response.answers[field.id]) ??
                Number(field.placeholder) ??
                0,
            ]}
            min={Number(field?.settings?.min ?? 0)}
            max={Number(field?.settings?.max ?? 100)}
            step={Number(field?.settings?.step ?? 1)}
            onValueChange={(values) => {
              update(field.id, values[0]);
            }}
          />
        </div>
      );
    }
  }
}
