"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { Upload } from "lucide-react";
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
}

export default function UploadButton({
  isLoading,
  isSubscribed,
}: UploadButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            sendGAEvent("dashboard-action", {
              action_name: "upload-dialog",
              value: 1,
            })
          }
          variant="primary"
          disabled={isLoading}
        >
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
