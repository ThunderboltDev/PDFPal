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

export default function UploadButton() {
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
        <Button variant="default">
          <Upload /> Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload PDF Files</DialogTitle>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
}
