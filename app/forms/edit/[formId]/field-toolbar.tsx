import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";

import { useState } from "react";
import {
  offset,
  flip,
  shift,
  useHover,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  safePolygon,
} from "@floating-ui/react";
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
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    middleware: [offset(8), flip(), shift()],
  });

  const hover = useHover(context, {
    restMs: 100,
    delay: { open: 100, close: 75 },
    handleClose: safePolygon(),
    mouseOnly: true,
  });

  const click = useClick(context, {
    toggle: true,
    ignoreMouse: true,
    stickIfOpen: false,
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps()}
      className="relative mb-4"
    >
      <FieldEditor
        field={field}
        index={index}
        update={update}
      />

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-10 p-0 m-0 -mt-2 bg-bg-200 border-1 border-bg-500 rounded-md"
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
            <span className="sr-only">Insert New Field</span>
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
            <span className="sr-only">Delete Current Field</span>
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
            <span className="sr-only">Move Selected Field Up</span>
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
            <span className="sr-only">Move Selected Field Down</span>
          </Button>
        </div>
      )}
    </div>
  );
}
