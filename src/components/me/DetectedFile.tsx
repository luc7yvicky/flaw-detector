import { RepoListData } from "@/types/type";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardTitle,
  CardTitleWrapper,
} from "../ui/Card";
import { Label } from "../ui/Label";


export default function DetectedFile({
  id,
  label,
  detectedAt,
  filename,
}: RepoListData) {
  return (
    <Card key={id}>
      <CardHeader hasMenu>
        <Label variant="outline-primary">{label}</Label>
      </CardHeader>
      <CardTitleWrapper>
        <CardTitle size="big" weight="normal" className="leading-tight">
          {detectedAt}
        </CardTitle>
        <CardSubTitle className="leading-none">{filename}</CardSubTitle>
      </CardTitleWrapper>
    </Card>
  );
}
