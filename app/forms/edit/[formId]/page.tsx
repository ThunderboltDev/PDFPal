"use client";

import { useParams } from "next/navigation";
import { useLocalStorage } from "react-use";
import { useState } from "react";

import type { Field, Form } from "@/firebase/types";

import TextEditor from "@/components/forms/textEditor";
import OverlayLoader from "@/components/ui/overlay-loader";
import { Button } from "@/components/ui/button";

export default function EditFormPage() {
  const { formId } = useParams();
  const [draftForm, setDraftForm] = useLocalStorage<Form | null>(
    `draft-form-${formId}`,
    null
  );

  const insetNewField = (position: number, type: string) => {
    const newField: Field = {
      id: crypto.randomUUID(),
      type: type,
      label: "Label",
      placeholder: "Placeholder Text",
      required: true,
      order: position,
    };

    setDraftForm(() => {
      if (!draftForm) return null;
      const before = draftForm.fields.slice(0, position + 1);
      const after = draftForm.fields.slice(position + 1);
      return {
        ...draftForm,
        fields: [...before, newField, ...after].map((fld, idx) => ({
          ...fld,
          order: idx,
        })),
      };
    });
  };

  if (!draftForm) {
    return <OverlayLoader loading={true} />;
  }

  return (
    <div className="pt-18 max-w-sm mx-auto">
      <TextEditor
        as="h1"
        value={draftForm.title}
        onChange={(val: string) => {
          setDraftForm((prev) => prev && { ...prev, title: val });
        }}
        placeholder="Enter title..."
        className="text-left"
      />
      <TextEditor
        as="p"
        value={draftForm.description}
        onChange={(val: string) => {
          setDraftForm((prev) => prev && { ...prev, description: val });
        }}
        placeholder="Enter description..."
        className="text-left"
      />
    </div>
  );
}
