import {
  Card,
  CardHeader,
  CardSubTitle,
  CardTitle,
  CardTitleWrapper,
} from "../ui/Card";
import { Label } from "../ui/Label";

export type RepoInfo = {
  id: string;
  label: string;
  labelStatus: string;
  repositoryName: string;
  caption: string;
  createdAt: string;
  detectedAt: string;
  filename: string;
};

export default function Repo({ id, label, repositoryName, caption }: RepoInfo) {
  return (
    <Card key={id}>
      <CardHeader hasMenu>
        <Label variant="outline">{label}</Label>
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
