"use server";

import { fetchRootStructure } from "@/lib/api/repositories";
import FileExplorer from "./FileExplorer";
import { auth } from "@/auth";

export default async function FileListServer({ repo }: { repo: string }) {
  const session = await auth();
  try {
    const rootStructure = await fetchRootStructure(
      session?.user?.username,
      repo,
    );
    return (
      <FileExplorer
        initialStructure={rootStructure}
        username={session?.user?.username}
        repo={repo}
      />
    );
  } catch (error) {
    return (
      <div>Error loading repository structure: {(error as Error).message}</div>
    );
  }
}
