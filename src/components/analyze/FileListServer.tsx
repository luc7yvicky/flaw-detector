"use server";

import { fetchRootStructure } from "@/lib/api/repositories";
import FileExplorer from "./FileExplorer";
import { auth } from "@/auth";

export default async function FileListServer({ repo }: { repo: string }) {
  const username = "joanshim";
  const session = await auth();
  console.log(session.user);
  try {
    const rootStructure = await fetchRootStructure(username, repo);
    return (
      <FileExplorer
        initialStructure={rootStructure}
        username={username}
        repo={repo}
      />
    );
  } catch (error) {
    return (
      <div>Error loading repository structure: {(error as Error).message}</div>
    );
  }
}
