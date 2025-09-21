"use client";

import { Loader2, Pencil, Save, Trash } from "lucide-react";

import z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "../_trpc/client";
import { Input } from "@/components/ui/input";
import ActionDialog from "@/components/ui/action-dialog";
import {
  Form,
  FormField,
  FormControl,
  FormError,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface DialogProps {
  file: {
    id: string;
    name: string;
  };
  disabled?: boolean;
}

const renameFileSchema = z.object({
  name: z
    .string()
    .min(1, "File name is required")
    .max(25, "File name is too long")
    .refine(
      (str) => !/[/\\\n\r]/.test(str),
      "File name cannot contain slashes or newlines"
    )
    .transform((str) => str.trim()),
});

type RenameForm = z.infer<typeof renameFileSchema>;

export function RenameFileDialog({ file, disabled }: DialogProps) {
  const utils = trpc.useUtils();

  const form = useForm<RenameForm>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: { name: file.name },
    mode: "onChange",
  });

  const { mutateAsync: renameFile } = trpc.file.renameFile.useMutation({
    onSuccess: () => {
      utils.file.getUserFiles.invalidate();
      toast.success("File name updated");
    },
    onError: () => {
      toast.error("Failed to rename file");
    },
  });

  useEffect(() => {
    form.reset({ name: file.name });
  }, [file.name, form]);

  const onSubmit = async (values: RenameForm) => {
    if (values.name === file.name) return;

    try {
      await renameFile({ id: file.id, newName: values.name });
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <ActionDialog
      dialog={{
        title: `Rename PDF File?`,
        description: (
          <>
            Rename file <strong>{file.name}</strong> to a new name.
          </>
        ),
        button: {
          variant: "info",
          children: (
            <>
              <Save className="size-4" />
              Save
            </>
          ),
          disabled: !form.formState.isDirty || !form.formState.isValid,
        },
        buttonChildrenWhenLoading: (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving
          </>
        ),
        children: (
          <div className="mb-6">
            <Form {...form}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New file name</FormLabel>
                    <FormControl>
                      <Input
                        type="name"
                        placeholder="New file name"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormError />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="hidden"
              >
                Submit
              </Button>
            </Form>
          </div>
        ),
      }}
      button={{
        size: "sm",
        variant: "ghost",
        className: "size-8 hover:bg-info/5 text-info/75 hover:text-info",
        children: (
          <>
            <Pencil className="size-4" />
            <span className="sr-only">Rename file name: {file.name}</span>
          </>
        ),
        disabled,
      }}
      onConfirm={async () => await form.handleSubmit(onSubmit)()}
    />
  );
}

export function DeleteFileDialog({ file, disabled }: DialogProps) {
  const utils = trpc.useUtils();

  const { mutateAsync: deleteFile } = trpc.file.deleteFile.useMutation({
    onSuccess: () => {
      utils.file.getUserFiles.invalidate();
      toast.success("File successfully deleted!");
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });

  const onSubmit = async () => {
    try {
      await deleteFile({ id: file.id });
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <ActionDialog
      dialog={{
        title: `Delete PDF File?`,
        description: (
          <>
            Are you sure you want to delete <strong>{file.name}</strong>. The
            file will be lost forever and this action cannot be undone.
          </>
        ),
        button: {
          variant: "danger",
          children: (
            <>
              <Trash className="size-4" />
              Delete
            </>
          ),
        },
        buttonChildrenWhenLoading: (
          <>
            <Loader2 className="size-4 animate-spin" />
            Deleting...
          </>
        ),
      }}
      button={{
        size: "sm",
        variant: "ghost",
        className: "size-8 hover:bg-danger/5 text-danger/75 hover:text-danger",
        children: (
          <>
            <Trash className="size-4" />
            <span className="sr-only">Delete File: ({file.name})</span>
          </>
        ),
        disabled,
      }}
      onConfirm={() => onSubmit()}
    />
  );
}
