export type FileStatus = "onCheck" | "onWait" | "error" | "success" | null;

export type FileResultProps = {
  id: string;
  name: string;
  vulnerability: string;
  severity: Critical | High | Medium | Low;
  descriptions: string[];
  modified_codes: string[];
  lines: string;
};
