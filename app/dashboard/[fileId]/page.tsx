import withAuth from "@/hoc/with-auth";
import FileView from "./file";

export const dynamic = "force-dynamic";

interface FileViewPageProps {
  params: Promise<{ fileId: string }>;
}

// Remove async and await if error

export default async function FileViewPage({ params }: FileViewPageProps) {
  const { fileId } = await params;

  const ProtectedFileView = withAuth(FileView, {
    origin: `/dashboard/${fileId}`,
  });
  return <ProtectedFileView fileId={fileId} />;
}
