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
