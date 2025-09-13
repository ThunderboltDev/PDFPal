"use client";

import { Cloud, File, Loader2 } from "lucide-react";

import Dropzone from "react-dropzone";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { trpc } from "@/app/_trpc/client";
import config from "@/config";

interface UploadDropzoneProps {
  isSubscribed: boolean;
}

export default function UploadDropzone({ isSubscribed }: UploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => router.push(`/dashboard/${file.id}`),
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgressBar = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((previousProgress) => {
        if (previousProgress >= 95) clearInterval(interval);
        return previousProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgressBar();
        const res = await startUpload(acceptedFile);

        if (!res) return toast.error("Something went wrong!");

        const [fileResponse] = res;
        const key = fileResponse.key;

        if (!key) return toast.error("Something went wrong!");

        startPolling({ key });

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border mx-4 h-64 border-dashed border-muted rounded-lg"
        >
          <div className="flex items-center justify-center size-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center size-full rounded-lg cursor-pointer bg-background/50 hover:bg-background/75"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="size-16 text-secondary-foreground mb-2" />
                <p className="mb-1 text-secondary-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF (up to{" "}
                  {isSubscribed
                    ? config.plans.pro.maxFileSize
                    : config.plans.free.maxFileSize}
                  )
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] && (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="size-4 text-primary" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    className="h-2 w-full"
                  />
                  {uploadProgress === 100 && (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="size-3 animate-spin" />
                      Redirecting...
                    </div>
                  )}
                </div>
              )}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
