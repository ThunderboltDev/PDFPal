"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { UserData, Form, LocalForm } from "@/firebase/types";
import {
  createNewDraftForm,
  fetchFormsByUserId,
  getDraftFormsFromStorage,
  publishForm,
} from "@/firebase/forms";

import { Button } from "@/components/ui/button";
import withAuth from "@/hoc/with-auth";
import FormsTable from "./form-table";
import DraftFormsTable from "./draft-table";
import OverlayLoader from "@/components/ui/overlay-loader";

interface DashboardProps {
  userData: UserData;
  user: null;
}

function Dashboard({ userData }: DashboardProps) {
  const [forms, setForms] = useState<Form[] | null>(null);
  const [draftForms, setDraftForms] = useState<LocalForm[] | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!userData) return;

    const fetchForms = async () => {
      const forms = await fetchFormsByUserId(userData.uid);
      setForms(forms);
      setDraftForms(getDraftFormsFromStorage());
    };

    fetchForms();
  }, [userData]);

  const handleFormView = (form: Form) => {
    router.push(`/forms/${form.id}`);
  };

  const handleFormSettings = (form: Form) => {
    router.push(`/forms/settings/${form.id}`);
  };

  const handleDraftEdit = (form: LocalForm) => {
    router.push(`/forms/edit/${form.id}`);
  };

  const handleDraftPreview = (form: LocalForm) => {
    router.push(`/forms/preview/${form.id}`);
  };

  const handleDraftDelete = (form: LocalForm) => {
    const key = `draft-form-${form.id}`;
    localStorage.removeItem(key);

    window.location.reload();
  };

  const handleDraftPublish = async (form: LocalForm) => {
    const formId = await publishForm(form, userData.uid);

    const key = `draft-form-${form.id}`;
    localStorage.removeItem(key);

    router.push(`/forms/published/${formId}`);
  };

  return (
    <div className="pt-18 px-6 max-w-2xl mx-auto space-y-4">
      <OverlayLoader loading={forms === null || draftForms === null} />
      <h2>Dashboard</h2>
      {draftForms?.length === 0 && forms?.length === 0 && (
        <p className="text-center">
          You haven&apos;t created any forms yet! <br />
          Click the button below to get started!
        </p>
      )}
      <FormsTable
        forms={forms}
        onView={handleFormView}
        onSettings={handleFormSettings}
      />
      <DraftFormsTable
        forms={draftForms}
        onEdit={handleDraftEdit}
        onDelete={handleDraftDelete}
        onPreview={handleDraftPreview}
        onPublish={handleDraftPublish}
      />
      <div className="grid place-items-center">
        <Button
          onClick={() => router.push(createNewDraftForm())}
          disabled={(userData?.formsCreated || 0) >= 5}
          variant="accent"
          size="small"
        >
          <Plus />
          Create New Form
        </Button>
      </div>
    </div>
  );
}

export default withAuth<DashboardProps>(Dashboard);
