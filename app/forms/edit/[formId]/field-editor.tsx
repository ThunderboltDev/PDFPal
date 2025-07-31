import { Field } from "@/firebase/types";

interface Props {
  field: Field;
  index: number;
  update: (index: number, field: Field) => void;
  sync: () => void;
}

export function FieldEditor({ field, index, update, sync }: Props) {
  return (
    <div style={{ padding: 4 }}>
      <input
        type="text"
        value={field.label}
        placeholder="Label"
        onChange={(e) => {
          update(index, { ...field, label: e.target.value });
          sync();
        }}
      />
      <input
        type="text"
        value={field.placeholder || ""}
        placeholder="Placeholder"
        onChange={(e) => {
          update(index, { ...field, placeholder: e.target.value });
          sync();
        }}
      />
      <label>
        <input
          type="checkbox"
          checked={Boolean(field.required)}
          onChange={() => {
            update(index, { ...field, required: !field.required });
            sync();
          }}
        />
        Required
      </label>
    </div>
  );
}
