import { useMemo } from "react";

import type { Form } from "@/firebase/types";
import Skeleton from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { formColumns } from "./form-columns";

interface FormTableProps {
  forms: Form[] | null;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
}

export default function FormsTable({
  forms,
  onEdit,
  onDelete,
}: FormTableProps) {
  const cols = useMemo(() => {
    return formColumns.map((col) => {
      if (col.id === "actions") {
        return { ...col, meta: { onEdit, onDelete } };
      }
      return col;
    });
  }, [onEdit, onDelete]);

  if (forms === null)
    return (
      <Skeleton
        className="rounded-xs"
        borderRadius={10}
        height={200}
      />
    );

  if (forms.length === 0) {
    return (
      <div>
        <p className="text-fg-300 text-center text-sm">
          No forms published yet.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={cols}
      data={forms}
    />
  );
}
