import CodeViewer from "@/components/analyze/CodeViewer";
import FileListServer from "@/components/analyze/FileListServer";
import {
  Status,
  StatusError,
  StatusSuccess,
  StatusWarning,
} from "@/components/analyze/Status";
import Button from "@/components/ui/Button";
import TitleBar from "@/components/ui/TitleBar";

export default function AnalyzePage({
  params,
}: {
  params: { repo_name: string };
}) {
  const repo = params.repo_name || "";

  const counts = {
    error: 8,
    warning: 12,
    success: 23,
  };

  return (
    <section className="mx-auto mb-7 w-full max-w-[110rem] px-[1rem]">
      <TitleBar title={repo} />
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <div className="flex flex-col gap-7">
          <Button className="h-[6.75rem] w-full">선택한 파일 검사</Button>
          <Status>
            <StatusError>{counts.error}</StatusError>
            <StatusWarning>{counts.warning}</StatusWarning>
            <StatusSuccess>{counts.success}</StatusSuccess>
          </Status>
          <FileListServer repo={repo} />
        </div>
        <CodeViewer />
      </div>
    </section>
  );
}
