"use client";

import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";

import { useState } from "react";
import { format } from "date-fns";
import { trpc } from "../_trpc/client";
import { Button, LinkButton } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { PropsWithDbUser } from "@/hoc/with-auth";

import UploadButton from "./upload-button";

interface DashboardProps {
  isSubscribed: boolean;
}

export default function Dashboard({
  isSubscribed,
}: PropsWithDbUser<DashboardProps>) {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => utils.getUserFiles.invalidate(),
    onMutate: ({ id }) => setDeletingFile(id),
    onSettled: () => setDeletingFile(null),
  });

  return (
    <main className="container-7xl mt-20">
      <div className="flex flex-col items-start justify-between gap-2 border-b border-gray-300 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="mb-1">My Files</h2>
        <UploadButton isSubscribed={isSubscribed} />
      </div>
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-100 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-gray-100 shadow-md transition hover:shadow-lg"
              >
                <LinkButton
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2 no-underline"
                >
                  <div className="py-3 px-6 w-full flex items-center justify-center space-x-3">
                    <div className="size-10 flex shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center">
                        <h5 className="truncate text-foreground">
                          {file.name}
                        </h5>
                      </div>
                    </div>
                  </div>
                </LinkButton>
                <div className="px-6 py-2 grid grid-cols-3 place-items-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Plus className="size-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4" />5
                  </div>
                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-2 aspect-square hover:bg-destructive/5 hover:text-destructive"
                  >
                    {deletingFile === file.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="mt-4">
          <Skeleton
            borderRadius={10}
            count={3}
            height={80}
          />
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="size-32 text-zinc-900" />
          <h4>Pretty empty over here...</h4>
          <p className="text-muted-foreground">Upload a PDF to get started!</p>
        </div>
      )}
    </main>
  );
}
