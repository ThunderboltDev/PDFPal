"use client";

import { useParams } from "next/navigation";
import { useLocalStorage, useMount } from "react-use";
import { useState } from "react";

import type { LocalForm } from "@/firebase/types";

import OverlayLoader from "@/components/ui/overlay-loader";
import { DynamicFormEditorRenderer } from "./editor-renderer";
import TextEditor from "./text-editor";
import EditorNavbar from "./navbar";

export default function EditFormPage() {
  const { formId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [draftForm, setDraftForm] = useLocalStorage<LocalForm | null>(
    `draft-form-${formId}`,
    null
  );

  useMount(() => setMounted(true));

  if (!draftForm || !mounted) {
    return <OverlayLoader loading />;
  }

  return (
    <div className="container-sm mt-18">
      <EditorNavbar formId={formId as string} />
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
        className="text-center"
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
        className="text-left mt-4"
      />
      <DynamicFormEditorRenderer
        draftForm={draftForm}
        setDraftForm={setDraftForm}
      />
    </div>
  );
}
