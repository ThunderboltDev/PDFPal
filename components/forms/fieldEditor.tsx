"use client";

import React, { useCallback } from "react";
import type { Field } from "@/firebase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldEditorProps {
  field: Field;
  index: number;
  total: number;
  onChange: (f: Field) => void;
  onDelete: (id: string) => void;
  onInsertBelow: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export default React.memo(function FieldEditor({
  field,
  index,
  total,
  onChange,
  onDelete,
  onInsertBelow,
  onMoveUp,
  onMoveDown,
}: FieldEditorProps) {
  const setLabel = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...field, label: e.target.value });
    },
    [field, onChange]
  );

  const setPlaceholder = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...field, placeholder: e.target.value });
    },
    [field, onChange]
  );

  const toggleRequired = useCallback(() => {
    onChange({ ...field, required: !field.required });
  }, [field, onChange]);

  return (
    <div
      data-field-id={field.id}
      style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}
    >
      <Input
        type="text"
        value={field.label}
        placeholder="Label"
        onChange={setLabel}
      />
      <Input
        type="text"
        value={field.placeholder || ""}
        placeholder="Placeholder"
        onChange={setPlaceholder}
      />
      <Label>
        <Input
          type="checkbox"
          checked={field.required || false}
          onChange={toggleRequired}
        />
        Required
      </Label>

      <div>
        <Button onClick={() => onDelete(field.id)}>Delete</Button>
        <Button onClick={() => onInsertBelow(index)}>Insert Below</Button>
        <Button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
        >
          ↑
        </Button>
        <Button
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
        >
          ↓
        </Button>
      </div>
    </div>
  );
});
