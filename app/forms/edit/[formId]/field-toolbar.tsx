import { useState } from "react";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { Button } from "../../../../components/ui/button";
import { Field } from "@/firebase/types";
import { FieldEditor } from "./field-editor";
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";

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
    placement: "bottom-start",
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
          className="z-1000 p-0 m-0 -mt-2 bg-bg-300 border-1 border-bg-500 rounded-md"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="text-accent-600"
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
            <Plus />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive"
            onClick={() => {
              remove(index);
              sync();
            }}
          >
            <Trash />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={index === 0}
            onClick={() => {
              move(index, index - 1);
              sync();
            }}
          >
            <ArrowUp />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={index === total - 1}
            onClick={() => {
              move(index, index + 1);
              sync();
            }}
          >
            <ArrowDown />
          </Button>
        </div>
      )}
    </div>
  );
}
