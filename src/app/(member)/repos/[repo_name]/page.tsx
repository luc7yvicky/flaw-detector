import { auth } from "@/auth";
import CodeViewer from "@/components/analyze/CodeViewer";
import FileListServer from "@/components/analyze/FileListServer";
import RunInspectButton from "@/components/analyze/RunInspectButton";
import {
  Status,
  StatusError,
  StatusSuccess,
  StatusWarning,
} from "@/components/analyze/Status";
import TitleBar from "@/components/ui/TitleBar";

export default async function RepoPage({
  params,
}: {
  params: { repo_name: string };
}) {
  const repo = params.repo_name || "";
  const session = await auth();
  const username = session?.user?.username;

  const counts = {
    error: "-",
    warning: "-",
    success: "-",
  };

  return (
    <section className="mx-auto mb-7 w-full max-w-[110rem] px-[1rem]">
      <TitleBar title={repo} />
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <div className="flex flex-col gap-7">
          <RunInspectButton repo={repo} username={username} />
          <Status>
            <StatusError>{counts.error}</StatusError>
            <StatusWarning>{counts.warning}</StatusWarning>
            <StatusSuccess>{counts.success}</StatusSuccess>
          </Status>
          <FileListServer repo={repo} username={username} />
        </div>
        <CodeViewer />
      </div>
    </section>
  );
}
