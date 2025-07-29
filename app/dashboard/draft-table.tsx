import { useMemo } from "react";

import type { LocalForm } from "@/firebase/types";
import Skeleton from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { draftFormColumns } from "./draft-columns";

interface DraftFormTableProps {
  forms: LocalForm[] | null;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
  onPublish: (formId: string) => void;
}

export default function FormsTable({
  forms,
  onEdit,
  onDelete,
  onPublish,
}: DraftFormTableProps) {
  const cols = useMemo(() => {
    return draftFormColumns.map((col) => {
      if (col.id === "actions") {
        return { ...col, meta: { onEdit, onDelete, onPublish } };
      }
      return col;
    });
  }, [onEdit, onDelete, onPublish]);

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
