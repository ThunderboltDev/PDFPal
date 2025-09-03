"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadDropzone from "./upload-dropzone";

interface UploadButtonProps {
  isSubscribed: boolean;
}

export default function UploadButton({ isSubscribed }: UploadButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {};

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger
        onClick={handleClick}
        asChild
      >
        <Button variant="primary">
          <Upload /> Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload PDF Files</DialogTitle>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
}
