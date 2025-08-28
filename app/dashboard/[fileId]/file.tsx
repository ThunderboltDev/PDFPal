import { notFound } from "next/navigation";
import { PropsWithDbUser } from "@/hoc/with-auth";
import ChatWrapper from "./chat/chat-wrapper";
import { db } from "@/lib/db";
import PDFRendererWrapper from "./pdf/pdf-renderer-wrapper";

interface FileViewProps {
  fileId: string;
}

export default async function FileView({
  dbUser,
  fileId,
}: PropsWithDbUser<FileViewProps>) {
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: dbUser.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] overflow-x-hidden">
      <div className="container-7xl grow md:flex xl:px-4">
        {/* Left Side */}
        <div className="flex-1 xl:flex">
          <div className="py-5 xl:flex-1">
            <PDFRendererWrapper fileUrl={file.url} />
          </div>
        </div>
        {/* Right Side */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 md:max-w-96 md:w-full md:border-l md:border-t-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}
