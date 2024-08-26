export type ArticleDetailProps = {
  title: string;
  content: string;
  createdAt: string;
  showLabel?: boolean;
  labelVariant?:
    | "hot"
    | "new"
    | "clipping"
    | "clipping-notify"
    | "clipping-warning";
  labelText?: string;
};

export type RepoListData = {
  id: number;
  repositoryName: string;
  label?: string;
  labelStatus?: string;
  caption?: string;
  createdAt?: string;
  detectedAt?: string;
  filename?: string;
};
