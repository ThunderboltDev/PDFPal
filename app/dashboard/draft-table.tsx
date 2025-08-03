"use client";

import { Pencil, Upload, Trash, ExternalLink } from "lucide-react";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import type { LocalForm } from "@/firebase/types";
import { PublishConfirmDialog } from "./dialogs/publish";
import { DeleteConfirmDialog } from "./dialogs/delete";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

export default function DraftFormsTable({
  forms,
  onEdit,
  onDelete,
  onPreview,
  onPublish,
}: {
  forms: LocalForm[] | null;
  onEdit: (form: LocalForm) => void;
  onDelete: (form: LocalForm) => void;
  onPreview: (form: LocalForm) => void;
  onPublish: (form: LocalForm) => void;
}) {
  const [modal, setModal] = useState<{
    type: "delete" | "publish";
    form: LocalForm;
  } | null>(null);

  const handleConfirm = () => {
    if (!modal) return;
    const { type, form } = modal;
    switch (type) {
      case "delete": {
        onDelete(form);
        break;
      }
      case "publish": {
        onPublish(form);
        break;
      }
    }
    setModal(null);
  };

  const columns = useMemo<ColumnDef<LocalForm>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => getValue(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const form = row.original!;
          return (
            <div className="flex justify-center">
              <Button
                size="icon"
                variant="ghost"
                className="mx-0 text-fg-500 hover:text-fg-100"
                onClick={() => onEdit(form)}
              >
                <Pencil className="size-4.5" />
                <span className="sr-only">Edit Form</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="mx-0 text-fg-500 hover:text-blue-600"
                onClick={() => onPreview(form)}
              >
                <ExternalLink className="size-4.5" />
                <span className="sr-only">Preview Form</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="mx-0 text-fg-500 hover:text-accent"
                onClick={() => setModal({ type: "publish", form: form })}
              >
                <Upload className="size-4.5" />
                <span className="sr-only">Publish Form</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="mx-0 text-fg-500 hover:text-destructive"
                onClick={() => setModal({ type: "delete", form: form })}
              >
                <Trash className="size-4.5" />
                <span className="sr-only">Delete Form</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onPreview]
  );

  if (!forms || forms.length === 0) return <></>;

  return (
    <>
      <p className="font-medium text-center mb-1">Drafted Forms</p>
      <DataTable
        columns={columns}
        data={forms}
      />
      {modal &&
        (modal.type === "delete" ? (
          <DeleteConfirmDialog
            open
            onOpenChange={() => setModal(null)}
            form={modal.form}
            onConfirm={handleConfirm}
          />
        ) : (
          <PublishConfirmDialog
            open
            onOpenChange={() => setModal(null)}
            form={modal.form}
            onConfirm={handleConfirm}
          />
        ))}
    </>
  );
}
