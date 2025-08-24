"use client";

import { Pencil, Upload, Trash, Eye } from "lucide-react";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import type { LocalForm } from "@/firebase/types";
import { PublishConfirmDialog } from "./dialogs/publish";
import { DeleteConfirmDialog } from "./dialogs/delete";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        cell: ({ getValue }) =>
          getValue() || <span className="italic">Untitled</span>,
      },
      {
        id: "end-actions",
        header: "Actions",
        cell: ({ row }) => {
          const form = row.original!;
          return (
            <div className="w-fit">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mx-0 text-fg-500 hover:text-fg-100"
                      onClick={() => onEdit(form)}
                    >
                      <Pencil className="size-4.5" />
                      <span className="sr-only">Edit Form</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Edit Form</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mx-0 text-fg-500 hover:text-blue-600"
                      onClick={() => onPreview(form)}
                    >
                      <Eye className="size-4.5" />
                      <span className="sr-only">Preview Form</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Preview Form</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mx-0 text-fg-500 hover:text-accent"
                      onClick={() => setModal({ type: "publish", form: form })}
                    >
                      <Upload className="size-4.5" />
                      <span className="sr-only">Publish Form</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Publish Form</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
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
                </TooltipTrigger>
                <TooltipContent>Delete Form</TooltipContent>
              </Tooltip>
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
