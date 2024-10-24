import { auth } from "@/auth";
import CodeContainer from "@/components/analyze/CodeContainer";
import FileList from "@/components/analyze/FileTree/FileList";
import RunInspectButton from "@/components/analyze/RunInspectButton";
import {
  Status,
  StatusMessage
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
      <div className="flex h-full min-h-dvh gap-7">
        <div className="flex w-full max-w-[16rem] flex-col gap-7">
          <RunInspectButton repo={repo} username={username} />
          <Status>
            <StatusMessage type="error">{counts.error}</StatusMessage>
            <StatusMessage type="warning">{counts.warning}</StatusMessage>
            <StatusMessage type="success">{counts.success}</StatusMessage>
          </Status>
          <FileList repo={repo} username={username} />
        </div>
        <CodeContainer username={username} repo={repo} />
      </div>
    </section>
  );
}
