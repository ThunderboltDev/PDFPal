export const dynamic = "force-dynamic";

import withAuth from "@/hoc/with-auth";
import FileView from "./file";

interface FileViewPageProps {
  params: Promise<{ fileId: string }>;
}

// Remove async and await if error

export default async function FileViewPage({ params }: FileViewPageProps) {
  const { fileId } = await params;

  const ProtectedFileView = withAuth(FileView, `/dashboard/${fileId}`);
  return <ProtectedFileView fileId={fileId} />;
}
