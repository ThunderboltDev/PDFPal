"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Cloud, File, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { type ReactNode, useId, useState } from "react";
import Dropzone from "react-dropzone";
import { trpc } from "@/app/_trpc/client";
import { Progress } from "@/components/ui/progress";
import config from "@/config";
import { useUploadThing } from "@/lib/uploadthing";

interface UploadDropzoneProps {
  isSubscribed: boolean;
}
function bytesToMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export default function UploadDropzone({ isSubscribed }: UploadDropzoneProps) {
  const [error, setError] = useState<string | ReactNode | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const router = useRouter();
  const id = useId();

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.file.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
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
      accept={{ "application/pdf": [".pdf"] }}
      multiple={false}
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
            </>,
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
            </>,
          );
        }

        setIsUploading(true);
        setError(null);

        sendGTMEvent({
          value: 1,
          event: "dashboard_action",
          action: "file_upload_started",
          subscription_plan: plan,
          file_size: bytesToMB(file.size),
          number_of_pages: numberOfPages,
        });

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

        sendGTMEvent({
          value: 1,
          event: "dashboard",
          action: "file_upload_complete",
          subscription_plan: plan,
          file_size: bytesToMB(file.size),
          number_of_pages: numberOfPages,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="mx-4 h-64 rounded-lg border border-gray-400 border-dashed"
        >
          <div className="flex size-full items-center justify-center">
            <div className="flex size-full cursor-pointer flex-col items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary/100">
              {isUploading && acceptedFiles && acceptedFiles[0] && (
                <div className="flex max-w-xs items-center divide-x divide-gray-300 overflow-hidden rounded-md bg-muted outline outline-gray-300">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="size-4 text-primary" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    aria-live="polite"
                    className="h-2 w-full"
                    indicatorColor={
                      uploadProgress === 100 ? "success" : "primary"
                    }
                    value={uploadProgress}
                  />
                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-muted-foreground text-sm">
                      <Loader2 className="size-3 animate-spin" />
                      Redirecting...
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud
                    className="mb-2 size-12 fill-muted text-secondary-foreground"
                    strokeWidth={1.5}
                  />
                  <p className="mb-1 text-secondary-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-muted-foreground text-sm">
                    PDF (up to{" "}
                    {isSubscribed
                      ? config.plans.pro.maxFileSize
                      : config.plans.free.maxFileSize}
                    )
                  </p>
                  <p className="mx-8 mt-3 text-center text-danger text-sm">
                    {error}
                  </p>
                </div>
              )}

              <input
                {...getInputProps()}
                id={id}
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
