"use client";

import { Ghost, MessageSquare, Plus } from "lucide-react";

import Link from "next/link";
import { format } from "date-fns";

import { trpc } from "../_trpc/client";
import UploadButton from "./upload-button";
import Skeleton from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PropsWithDbUser } from "@/hoc/with-auth";
import { DeleteFileDialog, RenameFileDialog } from "./dialogs";

interface DashboardProps {
  isSubscribed: boolean;
}

export default function Dashboard({
  isSubscribed,
}: PropsWithDbUser<DashboardProps>) {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  return (
    <main className="container-7xl mt-20">
      <div className="flex flex-col items-start justify-between gap-2 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="mb-1">My Files</h2>
        <UploadButton isSubscribed={isSubscribed} />
      </div>
      <Separator />
      {files && files.length !== 0 ? (
        <ul className="mt-8 px-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-secondary rounded-lg bg-background shadow-md transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex items-center justify-center px-4 py-3 gap-3 no-underline"
                >
                  <div className="size-10 flex shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-accent" />
                  <div className="flex-1 truncate">
                    <h5 className="truncate text-foreground">{file.name}</h5>
                  </div>
                </Link>
                <div className="grid grid-cols-3 gap-6 px-3 py-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Plus className="size-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <MessageSquare className="size-4" /> 5
                  </div>
                  <div className="flex flex-row gap-1.5 justify-end">
                    <RenameFileDialog file={file} />
                    <DeleteFileDialog file={file} />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="mt-9 grid grid-cols-1 gap-0 divide-y divide-zinc-100 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton
            borderRadius={10}
            height={80}
          />
          <Skeleton
            borderRadius={10}
            height={80}
          />
          <Skeleton
            borderRadius={10}
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
