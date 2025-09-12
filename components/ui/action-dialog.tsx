"use client";

import { ComponentProps, ReactNode, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { X } from "lucide-react";

interface ActionDialogProps extends ComponentProps<typeof Button> {
  dialog: {
    title: string | ReactNode;
    description: string | ReactNode;
  };
  button: ComponentProps<typeof Button>;
  onConfirm: () => void | Promise<void>;
}

export default function ActionDialog({
  dialog,
  button,
  onConfirm,
}: ActionDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        {...button}
      >
        {button.children}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogDescription>{dialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <DialogClose asChild>
              <Button
                variant="default"
                disabled={isLoading}
              >
                <X /> Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              {...button}
            >
              {button.children}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
