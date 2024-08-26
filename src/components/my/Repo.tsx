import { RepoListData } from "@/types/type";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardTitle,
  CardTitleWrapper,
} from "../ui/Card";
import { Label } from "../ui/Label";

export default function Repo({
  id,
  label,
  repositoryName,
  caption,
}: RepoListData) {
  return (
    <Card key={id}>
      <CardHeader hasMenu>
        {label && <Label variant="outline">{label}</Label>}
      </CardHeader>
      <CardTitleWrapper>
        <CardTitle size="big" weight="normal" className="leading-tight">
          {repositoryName}
        </CardTitle>
        <CardSubTitle className="leading-none">{caption}</CardSubTitle>
      </CardTitleWrapper>
    </Card>
  );
}
