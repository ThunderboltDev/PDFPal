"use client";

import { Cloud, File, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";
import { trpc } from "../_trpc/client";
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
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center size-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center size-full rounded-lg cursor-pointer bg-gray-200/50 hover:bg-gray-200/25"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="size-7 text-zinc-700 mb-2" />
                <p className="mb-2 text-sm text-zinc-600">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">
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
