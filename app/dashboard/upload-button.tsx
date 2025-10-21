"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadDropzone from "./upload-dropzone";

interface UploadButtonProps {
  isLoading: boolean;
  isSubscribed: boolean;
  hasLimitReached: boolean;
}

export default function UploadButton({
  isLoading,
  isSubscribed,
  hasLimitReached,
}: UploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    sendGTMEvent({
      event: "dashboard_action",
      action: "open_upload_dialog",
      value: 1,
    });

    if (hasLimitReached) {
      toast.error(
        isSubscribed
          ? "You've reached your upload limit for this plan."
          : "You've reached your free upload limit. Upgrade your plan to upload more files."
      );
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (hasLimitReached) {
          setIsOpen(false);
        } else {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="primary" disabled={isLoading} onClick={handleOpen}>
          <Upload /> Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF Files</DialogTitle>
        </DialogHeader>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
}
