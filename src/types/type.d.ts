export type ArticleDetailProps = {
  title: string;
  content: string;
  createdAt: string;
  showLabel?: boolean;
  labelVariant?: "hot" | "new";
  labelText?: string;
};
