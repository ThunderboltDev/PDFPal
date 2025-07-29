import { ColumnDef } from "@tanstack/react-table";

import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Form } from "@/firebase/types";

export const formColumns: ColumnDef<Form>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.getValue("title"),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const form = row.original;
      const meta = column.columnDef.meta as {
        onEdit?: (formId: string) => void;
        onDelete?: (formId: string) => void;
      };

      return (
        <div className="flex space-x-1">
          <Button
            variant="light"
            size="icon"
            onClick={() => meta?.onEdit?.(form.id)}
          >
            <Pencil />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => meta?.onDelete?.(form.id)}
          >
            <Trash />
          </Button>
        </div>
      );
    },
    meta: {},
  },
];
