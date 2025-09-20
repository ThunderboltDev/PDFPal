"use client";

import { Cloud, File, Loader2 } from "lucide-react";

import Dropzone from "react-dropzone";

import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { PDFDocument } from "pdf-lib";

import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { trpc } from "@/app/_trpc/client";
import config from "@/config";
import Link from "next/link";

interface UploadDropzoneProps {
  isSubscribed: boolean;
}

export default function UploadDropzone({ isSubscribed }: UploadDropzoneProps) {
  const [error, setError] = useState<string | ReactNode | null>(null);
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
        return previousProgress + Math.floor(Math.random() * 3) + 1;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      accept={{ "application/pdf": [".pdf"] }}
      onDrop={async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
          return setError("Please upload a PDF file!");
        }

        const plan = isSubscribed ? "pro" : "free";

        const data = await file.arrayBuffer();
        const document = await PDFDocument.load(data);
        const numberOfPages = document.getPageCount();

        const maxPages = config.plans[plan].maxPages;

        if (numberOfPages > maxPages) {
          return setError(
            <>
              Your PDF has {numberOfPages} pages but the limit is {maxPages}.{" "}
              {!isSubscribed && (
                <>
                  Upgrade to <Link href="/pricing#pro-plan">Pro Plan</Link> to
                  increase this limit!
                </>
              )}
            </>
          );
        }

        const maxSizeInBytes = config.plans[plan].maxFileSizeInBytes;

        if (file.size > maxSizeInBytes) {
          return setError(
            <>
              File size is larger than {config.plans[plan].maxFileSize}.{" "}
              {!isSubscribed && (
                <>
                  Upgrade to <Link href="/pricing#pro-plan">Pro Plan</Link> to
                  increase file size limit!
                </>
              )}
            </>
          );
        }

        setIsUploading(true);
        setError(null);

        const progressInterval = startSimulatedProgressBar();
        const res = await startUpload(acceptedFiles);

        if (!res) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setUploadProgress(0);
          return setError("Something went wrong! Please try again.");
        }

        const [fileResponse] = res;
        const key = fileResponse.key;

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
            <div className="flex flex-col items-center justify-center size-full rounded-lg cursor-pointer bg-background/50 hover:bg-background/75">
              {isUploading && acceptedFiles && acceptedFiles[0] && (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="size-4 text-primary" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    indicatorColor={
                      uploadProgress === 100 ? "success" : "primary"
                    }
                    className="h-2 w-full"
                    aria-live="polite"
                  />
                  {uploadProgress === 100 && (
                    <div className="flex gap-1 items-center justify-center text-sm text-muted-foreground text-center pt-2">
                      <Loader2 className="size-3 animate-spin" />
                      Redirecting...
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud className="size-12 text-secondary-foreground mb-2" />
                  <p className="mb-1 text-secondary-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF (up to{" "}
                    {isSubscribed
                      ? config.plans.pro.maxFileSize
                      : config.plans.free.maxFileSize}
                    )
                  </p>
                  <p className="text-sm text-center text-danger mx-8 mt-3">
                    {error}
                  </p>
                </div>
              )}

              <input
                {...getInputProps()}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
