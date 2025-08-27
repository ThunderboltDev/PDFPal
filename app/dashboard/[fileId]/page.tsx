import withAuth from "@/hoc/with-auth";
import FileView from "./file";

interface FileViewPageProps {
  params: { fileId: string };
}

export default async function FileViewPage({ params }: FileViewPageProps) {
  const { fileId } = await params;

  const ProtectedFileView = withAuth(FileView, `/dashboard/${fileId}`);
  return <ProtectedFileView fileId={fileId} />;
}
