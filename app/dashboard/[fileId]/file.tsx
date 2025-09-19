import { notFound } from "next/navigation";
import { PropsWithDbUser } from "@/hoc/with-auth";
import { db } from "@/lib/db";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import ChatWrapper from "./chat/chat-wrapper";
import PDFRendererWrapper from "./pdf/pdf-renderer-wrapper";
import { getUserSubscriptionPlan } from "@/lib/creem";

interface FileViewProps {
  fileId: string;
}

export default async function FileView({
  dbUser,
  fileId,
}: PropsWithDbUser<FileViewProps>) {
  const { isSubscribed } = await getUserSubscriptionPlan();
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: dbUser.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="mt-14">
      <div className="hidden md:flex">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={60}
            minSize={25}
          >
            <PDFRendererWrapper fileUrl={file.url} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={40}
            minSize={25}
          >
            <ChatWrapper
              fileId={fileId}
              isSubscribed={isSubscribed}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex flex-col md:hidden">
        <main className="overflow-auto">
          <PDFRendererWrapper fileUrl={file.url} />
        </main>
        <aside className="flex-1 border-t border-secondary">
          <ChatWrapper
            fileId={fileId}
            isSubscribed={isSubscribed}
          />
        </aside>
      </div>
    </div>
  );
}
