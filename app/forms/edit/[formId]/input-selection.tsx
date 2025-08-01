"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { allFieldTypes, FieldType } from "@/firebase/types";
import {
  fieldTypeToIcon,
  fieldTypeToLabel,
} from "@/components/forms/field-config";

interface DeleteConfirmDialogProps {
  open: boolean;
  insertField: (fieldType: FieldType) => void;
  onOpenChange: (open: boolean) => void;
}

export function InsertInputSelection({
  open,
  insertField,
  onOpenChange,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="relative z-1000">
        <DialogHeader>
          <DialogTitle>Select Type</DialogTitle>
        </DialogHeader>
        <DialogDescription className="grid grid-cols-2 gap-0.5">
          {allFieldTypes.map((fieldType) => {
            return (
              <Button
                key={fieldType}
                variant="light"
                size="default"
                className="w-full rounded-none"
                onClick={() => insertField(fieldType)}
              >
                {fieldTypeToIcon[fieldType]}
                {fieldTypeToLabel[fieldType]}
              </Button>
            );
          })}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
