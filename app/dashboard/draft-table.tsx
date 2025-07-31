"use client";

import { Pencil, Upload, Trash } from "lucide-react";

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
  onPublish,
}: {
  forms: LocalForm[] | null;
  onEdit: (form: LocalForm) => void;
  onDelete: (form: LocalForm) => void;
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
            <div className="flex space-x-1">
              <Button
                size="icon"
                variant="light"
                onClick={() => onEdit(form)}
              >
                <Pencil />
              </Button>
              <Button
                size="icon"
                variant="accent"
                onClick={() => setModal({ type: "publish", form: form })}
              >
                <Upload />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => setModal({ type: "delete", form: form })}
              >
                <Trash />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit]
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
