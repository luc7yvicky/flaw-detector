import { ArticleListItem, VulDBPostLabel } from "@/types/post";
import { Card, CardHeader, CardSubTitle, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";
import { formatDateToYYYYMMDDhhmmss } from "@/lib/utils";

export default function ScrappedArticleListItem({
  label,
  title,
  createdAt,
}: ArticleListItem) {
  const labelVariant = (label: VulDBPostLabel) => {
    switch (label) {
      case "취약성 보고서":
        return "clipping";
      case "취약성 알림":
        return "clipping-notify";
      case "기타":
        return "clipping-etc";
      default:
        return "clipping";
    }
  };

  return (
    <Card size="extended">
      <CardHeader>
        <Label variant={labelVariant(label)}>{label}</Label>
      </CardHeader>
      <CardTitle className="flex-none">{title}</CardTitle>
      <CardSubTitle>{formatDateToYYYYMMDDhhmmss(createdAt)}</CardSubTitle>
    </Card>
  );
}
