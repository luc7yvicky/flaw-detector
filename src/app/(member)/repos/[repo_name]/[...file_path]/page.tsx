"use client";

import { useFileProcessStore } from "@/stores/useFileProcessStore";
import { useRouter } from "next/navigation";

export default function DetectedFilePage({
  params,
}: {
  params: { repo_name: string; file_path: string };
}) {
  const router = useRouter();
  const getFileStatus = useFileProcessStore((state) => state.getFileStatus);
  const status = getFileStatus(params.file_path);

  if (status !== "success") {
    router.replace(`/repos/${params.repo_name}`);
  }

  return null;
}
