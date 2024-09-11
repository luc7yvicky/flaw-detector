import { auth } from "@/auth";
import { getDetectedResultsByFile } from "@/lib/api/repositories";
import { redirect } from "next/navigation";

export default async function DetectedFilePage({
  params,
}: {
  params: { repo_name: string; file_path: string[] };
}) {
  // const session = await auth();
  // const filePaths = params.file_path;

  // const { mode } = await getDetectedResultsByFile(
  //   session?.user?.username,
  //   filePaths.join("/"),
  // );

  // if (mode === "undetected") {
  redirect(`/repos/${params.repo_name}`);
  // }

  // return null;
}
