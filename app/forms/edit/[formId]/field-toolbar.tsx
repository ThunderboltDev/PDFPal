import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";

import { useState } from "react";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { Button } from "../../../../components/ui/button";
import { FieldEditor } from "./field-editor";
import type { Field } from "@/firebase/types";

interface FieldEditorProps {
  field: Field;
  index: number;
  total: number;
  insert: (index: number) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  update: (index: number, field: Field) => void;
}

export function FieldWithToolbar({
  field,
  index,
  total,
  insert,
  remove,
  move,
  update,
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
      />

      {hovered && (
        <div
          ref={refs.setFloating}
          className="z-10 p-0 m-0 -mt-2 bg-bg-200 border-1 border-bg-500 rounded-md"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="text-accent"
            onClick={() => {
              insert(index + 1);
            }}
          >
            <Plus className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive"
            onClick={() => {
              remove(index);
            }}
          >
            <Trash className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={index === 0}
            onClick={() => {
              move(index, index - 1);
            }}
          >
            <ArrowUp className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={index === total - 1}
            onClick={() => {
              move(index, index + 1);
            }}
          >
            <ArrowDown className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
