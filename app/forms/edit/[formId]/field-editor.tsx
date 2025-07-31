import { ChangeEvent } from "react";
import { Field } from "@/firebase/types";
import TextEditor from "./text-editor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Asterisk } from "lucide-react";

interface FieldEditorProps {
  field: Field;
  index: number;
  update: (index: number, field: Field) => void;
  sync: () => void;
}

export function FieldEditor({ field, index, update, sync }: FieldEditorProps) {
  return (
    <div style={{ padding: 4 }}>
      <div className="flex flex-row translate-x-1">
        <TextEditor
          as="span"
          value={field.label}
          placeholder="Label"
          onChange={(text: string) => {
            update(index, { ...field, label: text });
            sync();
          }}
        />
        <Checkbox
          id={`field-required-${field.id}`}
          title="Toggle Required"
          aria-label="Toggle Required"
          checked={Boolean(field.required)}
          onCheckedChange={() => {
            update(index, { ...field, required: !field.required });
            sync();
          }}
        >
          <Asterisk />
        </Checkbox>
      </div>
      <Input
        id={field.id}
        name={field.id}
        type="text"
        value={field.placeholder || ""}
        placeholder="Placeholder"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          update(index, { ...field, placeholder: e?.target?.value ?? "" });
          sync();
        }}
      />
    </div>
  );
}
