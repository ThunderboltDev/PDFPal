import { Field } from "@/firebase/types";
import { fieldTypeToLabel } from "@/components/forms/field-config";
import { RequiredToggle } from "./required-toggle";
import TextEditor from "./text-editor";
import RenderInput from "./render-input";

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
          placeholder={fieldTypeToLabel[field.type]}
          onChange={(text: string) => {
            update(index, { ...field, label: text });
          }}
          className="mb-0.5 md:text-sm"
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
      <RenderInput
        field={field}
        update={update}
      />
    </div>
  );
}
