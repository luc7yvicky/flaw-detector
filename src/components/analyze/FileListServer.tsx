"use server";

import { fetchRootStructure } from "@/lib/api/repositories";
import FileExplorer from "./FileExplorer";

export default async function FileListServer({
  repo,
  username,
}: {
  repo: string;
  username: string;
}) {
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
