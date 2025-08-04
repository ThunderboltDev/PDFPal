"use client";

import { ExternalLink, Settings } from "lucide-react";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

import type { Form } from "@/firebase/types";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FormsTable({
  forms,
  onView,
  onSettings,
}: {
  forms: Form[] | null;
  onView: (form: Form) => void;
  onSettings: (form: Form) => void;
}) {
  const columns = useMemo<ColumnDef<Form>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ getValue }) =>
          getValue() || <span className="italic">Untitled</span>,
      },
      {
        id: "center-responses",
        accessorKey: "responses",
        header: "Responses",
        cell: ({ getValue }) => (
          <span className="mx-auto w-fit">{String(getValue() || 0)}</span>
        ),
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
                      className="mx-0 text-fg-500 hover:text-blue-600"
                      onClick={() => onView(form)}
                    >
                      <ExternalLink className="size-4.5" />
                      <span className="sr-only">View Form</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>View Form</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mx-0 text-fg-500 hover:text-fg-100"
                      onClick={() => onSettings(form)}
                    >
                      <Settings className="size-4.5" />
                      <span className="sr-only">Form Settings</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Form Settings</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [onSettings, onView]
  );

  if (!forms || forms.length === 0) return <></>;

  return (
    <>
      <p className="font-medium text-center mb-1">Published Forms</p>
      <DataTable
        columns={columns}
        data={forms}
      />
    </>
  );
}
