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
    <section className="mx-auto mb-7 h-full w-full min-w-[64rem] max-w-[110rem] px-[1rem]">
      <TitleBar title={repo} />
      <div className="flex h-full gap-7">
        <div className="flex w-full max-w-[16rem] flex-col gap-7">
          <RunInspectButton repo={repo} username={username} />
          <Status>
            <StatusError>{counts.error}</StatusError>
            <StatusWarning>{counts.warning}</StatusWarning>
            <StatusSuccess>{counts.success}</StatusSuccess>
          </Status>
          <FileListServer repo={repo} username={username} />
        </div>
        <CodeViewer username={username} repo={repo} />
      </div>
    </section>
  );
}
