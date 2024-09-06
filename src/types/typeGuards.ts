import { CertCCContent, CnnvdContent } from "./post";

export const isCertCCContentType = (
  content: CertCCContent | CnnvdContent,
): content is CertCCContent => {
  return (content as CertCCContent).overview !== undefined;
};
