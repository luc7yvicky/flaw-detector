"use server";

import { fetchRootStructure } from "@/lib/repositories";
import FileExplorer from "./FileExplorer";

export default async function FileListServer({
  username,
  repo,
}: {
  username: string;
  repo: string;
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
