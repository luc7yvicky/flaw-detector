import CodeViewer from "@/components/analyze/CodeViewer";
import FileList from "@/components/analyze/FileList";

export default function AiAnalyze() {
  return (
    <section className="mx-auto w-full max-w-[110rem]">
      <div className="grid grid-cols-[16rem_1fr] gap-7">
        <div>button</div>
        <div>[progress bar]</div>
        <div>
          <div>status panel</div>
          <FileList />
        </div>
        <CodeViewer />
      </div>
    </section>
  );
}
