import { notFound } from "next/navigation";
import { PropsWithDbUser } from "@/hoc/with-auth";
import PDFRenderer from "./pdf-renderer";
import ChatWrapper from "./chat-wrapper";
import { db } from "@/lib/db";

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
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="container-7xl grow md:flex xl:px-4">
        {/* Left Side */}
        <div className="flex-1 xl:flex">
          <div className="px-2 py-5 sm:px-4 md:px-6 xl:flex-1 xl:pl-8">
            <PDFRenderer />
          </div>
        </div>
        {/* Right Side */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 md:w-96 md:border-l md:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}
