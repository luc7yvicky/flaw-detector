import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { formatTimestampAsDaysAgo } from "@/lib/utils";
import {
  CertCCContent,
  CnnvdContent,
  VulDBPinnedInfo,
  VulDBPostWithChip,
} from "@/types/post";
import { isCertCCContentType, isCnnvdContentType } from "@/types/typeGuards";
import ScrapButton from "../common/ScrapButton";
import ShareButton from "../common/ShareButton";

export default function PostCard({
  post,
  userId,
}: {
  post: VulDBPostWithChip;
  userId: number;
}) {
  if (!post) return null;

  const pinnedInfo: VulDBPinnedInfo = { userId, postId: post.id };
  const daysAgo = formatTimestampAsDaysAgo(post.created_at);

  const renderCertCCContent = (content: CertCCContent) => {
    const overview =
      content?.overview?.translated[0] || content?.overview?.original[0];
    if (overview.text) {
      return overview.text;
    }
    return "내용을 불러오는 데 실패했습니다.";
  };

  const renderCnnvdContent = (content: CnnvdContent) => {
    const description =
      content?.description?.translated || content?.description?.original;

    if (!description) {
      return "내용을 불러오는 데 실패했습니다.";
    } else {
      return description;
    }
  };

  const contentText =
    post.source === "CERT/CC" && isCertCCContentType(post.content)
      ? renderCertCCContent(post.content)
      : post.source === "CNNVD" && isCnnvdContentType(post.content)
        ? renderCnnvdContent(post.content)
        : "내용을 불러오는 데 실패했습니다.";

  return (
    <Card
      variant="article"
      size="long"
      className="h-[16.875rem] rounded-[1.25rem] border-line-light"
    >
      <CardHeader>
        <div className="mb-3 flex items-center gap-2">
          {post.chip === "new" && <Label variant="new">NEW</Label>}
          {post.chip === "hot" && <Label>HOT</Label>}
          <CardTitle
            size="small"
            weight="bold"
            color="black"
            className="line-clamp-1"
          >
            {post.title?.translated ||
              post.title?.original ||
              "제목을 불러오는 데 실패했습니다."}
          </CardTitle>
        </div>
        <CardSubTitle
          isSingleLine
          className="block truncate font-medium text-[#767676]"
        >
          {post.source || "출처를 알 수 없음"}
        </CardSubTitle>
      </CardHeader>
      <CardContent className="bg-purple-light">
        <div className="block truncate text-base font-medium text-[#727272]">
          {contentText}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-[0.625rem]">
          <ScrapButton pinnedInfo={pinnedInfo} isScrapped={post.isScrapped} />
          <ShareButton postId={post.id} />
        </div>
        <CardSubTitle color="#767676" className="font-medium">
          {daysAgo || "날짜를 알 수 없음"}
        </CardSubTitle>
      </CardFooter>
    </Card>
  );
}
