import { ChangeEvent } from "react";
import { Field } from "@/firebase/types";
import TextEditor from "./text-editor";
import { Input } from "@/components/ui/input";
import { RequiredToggle } from "./required-toggle";

interface FieldEditorProps {
  field: Field;
  index: number;
  update: (index: number, field: Field) => void;
}

export function FieldEditor({ field, index, update }: FieldEditorProps) {
  return (
    <div>
      <div className="flex flex-row translate-x-1">
        <TextEditor
          as="span"
          value={field.label}
          placeholder="Label"
          onChange={(text: string) => {
            update(index, { ...field, label: text });
          }}
        />
        <RequiredToggle
          id={`field-required-${field.id}`}
          title="Toggle Required"
          aria-label="Toggle Required"
          checked={Boolean(field.required)}
          className="translate-x-1"
          onCheckedChange={() => {
            update(index, { ...field, required: !field.required });
          }}
        />
      </div>
      <Input
        id={field.id}
        name={field.id}
        type="text"
        value={field.placeholder || ""}
        placeholder="Placeholder"
        className="text-fg-500"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          update(index, { ...field, placeholder: e?.target?.value ?? "" });
        }}
      />
    </div>
  );
}
