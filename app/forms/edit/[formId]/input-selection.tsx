"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldType } from "@/firebase/types";
import {
  allFieldTypes,
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
      <DialogContent className="z-1000">
        <DialogHeader>
          <DialogTitle>Select Type</DialogTitle>
        </DialogHeader>
        <DialogDescription className="grid grid-cols-2 gap-x-4">
          {allFieldTypes.map((fieldType) => {
            return (
              <Button
                key={fieldType}
                variant="ghost"
                size="default"
                className="w-full text-fg-200 hover:text-fg-100 px-3 py-1.5 justify-start rounded-sm font-normal [&_svg]:stroke-fg-400 hover:[&_svg]:stroke-fg-200"
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
