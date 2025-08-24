"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Form, LocalForm } from "@/firebase/types";

interface PublishConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  form: Form | LocalForm;
}

export function PublishConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  form,
}: PublishConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish &quot;{form.title}&quot;?</DialogTitle>
          <DialogDescription>
            Are you sure you want to publish{" "}
            <span className="font-semibold">{form.title}</span>?
            <br />
            Publishing the form will allow anyone with the link to submit
            responses. You won&apos;t be able to makes changes to it after it is
            published! You can change the visibility in the{" "}
            <span className="font-semibold">Settings</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <DialogClose asChild>
            <Button variant="light">
              <X />
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="accent"
            onClick={onConfirm}
          >
            <Upload />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
