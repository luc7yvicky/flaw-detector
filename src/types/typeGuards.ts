import { CertCCContent, CnnvdContent } from "./type";

export const isCertCCContentType = (
  content: CertCCContent | CnnvdContent,
): content is CertCCContent => {
  return (content as CertCCContent).overview !== undefined;
};

export const isCnnvdContentType = (
  content: CertCCContent | CnnvdContent,
): content is CnnvdContent => {
  return (
    "description" in content &&
    typeof content.description === "object" &&
    "original" in content.description &&
    "translated" in content.description
  );
};
