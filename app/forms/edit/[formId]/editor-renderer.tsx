"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldWithToolbar } from "./field-toolbar";
import type { LocalForm, Field } from "@/firebase/types";
import { Plus } from "lucide-react";

type EditorProps = {
  draftForm: LocalForm;
  setDraftForm: (form: LocalForm) => void;
};

export function DynamicFormEditorRenderer({
  draftForm,
  setDraftForm,
}: EditorProps) {
  const { control, getValues } = useForm<{ fields: Field[] }>({
    defaultValues: { fields: draftForm.fields },
  });

  const { fields, insert, remove, move, update } = useFieldArray({
    control,
    name: "fields",
  });

  const sync = () => {
    const syncedFields = getValues("fields").map((f, i) => ({
      ...f,
      order: i,
    }));
    setDraftForm({ ...draftForm, fields: syncedFields });
  };

  const addInitialField = () => {
    const newField: Field = {
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      order: 0,
    };
    insert(0, newField);
    sync();
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <Button
          variant="default"
          size="small"
          onClick={addInitialField}
        >
          <Plus />
          Add First Field
        </Button>
      ) : (
        fields.map((field, index) => (
          <FieldWithToolbar
            key={field.id}
            field={field}
            index={index}
            total={fields.length}
            insert={insert}
            remove={remove}
            move={move}
            update={update}
            sync={sync}
          />
        ))
      )}
    </div>
  );
}
