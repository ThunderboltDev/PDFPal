"use client";

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
  isSubscribed: boolean;
}

export default function UploadButton({ isSubscribed }: UploadButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">
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
