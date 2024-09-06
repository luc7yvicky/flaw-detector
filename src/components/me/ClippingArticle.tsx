import { ArticleDetailProps } from "@/types/post";
import { Card, CardHeader, CardSubTitle, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";

export default function ClippingArticle({
  labelVariant,
  labelText,
  title,
  createdAt,
}: ArticleDetailProps) {
  return (
    <Card size="extended">
      <CardHeader>
        <Label variant={labelVariant}>{labelText}</Label>
      </CardHeader>
      <CardTitle className="flex-none">{title}</CardTitle>
      <CardSubTitle>{createdAt}</CardSubTitle>
    </Card>
  );
}
