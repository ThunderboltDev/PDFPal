import { useState } from "react";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { Button } from "../../../../components/ui/button";
import { Field } from "@/firebase/types";
import { FieldEditor } from "./field-editor";

interface FieldEditorProps {
  field: Field;
  index: number;
  total: number;
  insert: (index: number, field: Field) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  update: (index: number, field: Field) => void;
  sync: () => void;
}

export function FieldWithToolbar({
  field,
  index,
  total,
  insert,
  remove,
  move,
  update,
  sync,
}: FieldEditorProps) {
  const [hovered, setHovered] = useState(false);
  const { x, y, refs, strategy } = useFloating({
    placement: "top-end",
    middleware: [offset(8), flip(), shift()],
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", marginBottom: "1rem" }}
    >
      <FieldEditor
        field={field}
        index={index}
        update={update}
        sync={sync}
      />

      {hovered && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            background: "white",
            border: "1px solid #ccc",
            padding: 4,
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          <Button
            onClick={() => {
              insert(index + 1, {
                id: crypto.randomUUID(),
                type: field.type,
                label: "",
                placeholder: "",
                required: false,
                order: index + 1,
              });
              sync();
            }}
          >
            Insert
          </Button>
          <Button
            onClick={() => {
              remove(index);
              sync();
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              move(index, index - 1);
              sync();
            }}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            onClick={() => {
              move(index, index + 1);
              sync();
            }}
            disabled={index === total - 1}
          >
            ↓
          </Button>
        </div>
      )}
    </div>
  );
}
