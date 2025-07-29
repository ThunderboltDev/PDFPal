"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-use";

import type { UserData, Form, LocalForm } from "@/firebase/types";
import { deleteFormById, fetchFormsByUserId } from "@/firebase/forms";

import { Button } from "@/components/ui/button";
import withAuth from "@/hoc/with-auth";
import FormsTable from "./form-table";
import DraftFormsTable from "./draft-table";

interface DashboardProps {
  userData: UserData;
  user: null;
}

function Dashboard({ userData }: DashboardProps) {
  const [forms, setForms] = useState<Form[] | null>(null);
  const [draftForms, setDraftForms] = useState<LocalForm[] | null>(null);

  const router = useRouter();

  const newFormId = crypto.randomUUID();

  const [, setNewForm] = useLocalStorage<LocalForm | null>(
    `draft-form-${newFormId}`,
    null
  );

  function getDraftFormsFromStorage(): LocalForm[] {
    const results: LocalForm[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("draft-form-")) {
        const raw = localStorage.getItem(key);

        if (raw) {
          try {
            const form = JSON.parse(raw) as LocalForm;
            if (form.isDraft) results.push(form);
          } catch {}
        }
      }
    }

    return results;
  }

  useEffect(() => {
    if (!userData) return;

    const fetchForms = async () => {
      const forms = await fetchFormsByUserId(userData.uid);
      setForms(forms);
      setDraftForms(getDraftFormsFromStorage());
    };

    fetchForms();
  }, [userData]);

  const handleCreateNewForm = async () => {
    const defaultForm: LocalForm = {
      id: newFormId,
      title: "Form Title",
      description: "A very cool description!",
      fields: [],
      isDraft: true,
    };

    setNewForm(defaultForm);
    router.push(`forms/edit/${newFormId}`);
  };

  const handleFormEdit = (formId: string) => {
    router.push(`/forms/edit/${formId}`);
  };

  const handleFormDelete = async (formId: string) => {
    await deleteFormById(formId, userData.uid);
    if (forms) setForms(forms.filter((form) => form.id !== formId));
  };

  const handleDraftEdit = (formId: string) => {};
  const handleDraftDelete = (formId: string) => {};
  const handleDraftPublish = (formId: string) => {};

  return (
    <div className="pt-18 px-6 max-w-2xl mx-auto space-y-4">
      <h2>Dashboard</h2>
      <div className="grid place-items-center">
        <Button
          onClick={() => handleCreateNewForm()}
          variant="accent"
          size="small"
        >
          <Plus />
          Create New Form
        </Button>
      </div>
      <FormsTable
        forms={forms}
        onEdit={handleFormEdit}
        onDelete={handleFormDelete}
      />
      <DraftFormsTable
        forms={draftForms}
        onEdit={handleDraftEdit}
        onDelete={handleDraftDelete}
        onPublish={handleDraftPublish}
      />
    </div>
  );
}

export default withAuth<DashboardProps>(Dashboard);
