"use client";

import { useParams } from "next/navigation";
import { useLocalStorage, useMount } from "react-use";
import { useState } from "react";

import type { Field, FieldType, LocalForm } from "@/firebase/types";

import TextEditor from "@/app/forms/edit/[formId]/text-editor";
import OverlayLoader from "@/components/ui/overlay-loader";
import { DynamicFormEditorRenderer } from "./editor-renderer";

export default function EditFormPage() {
  const { formId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [draftForm, setDraftForm] = useLocalStorage<LocalForm | null>(
    `draft-form-${formId}`,
    null
  );

  useMount(() => setMounted(true));

  const insertNewField = (position: number, type: FieldType) => {
    const newField: Field = {
      id: crypto.randomUUID(),
      type: type,
      label: "Label",
      placeholder: "Placeholder Text",
      required: true,
      order: position,
    };

    setDraftForm((prev) => {
      if (!prev) return null;
      const before = prev.fields.slice(0, position + 1);
      const after = prev.fields.slice(position + 1);
      return {
        ...prev,
        fields: [...before, newField, ...after].map((fld, idx) => ({
          ...fld,
          order: idx,
        })),
      };
    });
  };

  if (!draftForm || !mounted) {
    return <OverlayLoader loading />;
  }

  return (
    <div className="pt-18 max-w-sm mx-auto">
      <TextEditor
        as="h1"
        value={draftForm.title}
        onChange={(val: string) => {
          setDraftForm({
            ...draftForm,
            title: val,
          });
        }}
        placeholder="Enter title..."
        className="text-left"
      />
      <TextEditor
        as="p"
        value={draftForm.description}
        onChange={(val: string) => {
          setDraftForm({
            ...draftForm,
            description: val,
          });
        }}
        placeholder="Enter description..."
        className="text-left"
      />
      <DynamicFormEditorRenderer
        draftForm={draftForm}
        setDraftForm={setDraftForm}
      />
    </div>
  );
}
