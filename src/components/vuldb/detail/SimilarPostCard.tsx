import {
  Card,
  CardFooter,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import ScrapButton from "@/components/vuldb/common/ScrapButton";
import ShareButton from "@/components/vuldb/common/ShareButton";
import { formatTimestampAsDaysAgo } from "@/lib/utils";
import { VulDBPinnedInfo, VulDBPostWithChip } from "@/types/post";
import { isCertCCContentType, isCnnvdContentType } from "@/types/typeGuards";

export default function SimilarPostCard({
  post,
  userId,
}: {
  post: VulDBPostWithChip;
  userId: number;
}) {
  if (!post) return null;

  const pinnedInfo: VulDBPinnedInfo = { userId, postId: post.id };

  const renderPostContent = (post: VulDBPostWithChip) => {
    if (post.source === "CERT/CC" && isCertCCContentType(post.content)) {
      const overview = post.content?.overview;
      return (
        overview?.translated[0]?.text ||
        overview?.original[0]?.text ||
        "내용을 불러오는 데 실패했습니다."
      );
    }

    if (post.source === "CNNVD" && isCnnvdContentType(post.content)) {
      const description = post.content?.description;
      return (
        description?.translated ||
        description?.original ||
        "내용을 불러오는 데 실패했습니다."
      );
    }

    return null;
  };

  return (
    <Card
      variant="article"
      size="short"
      className="h-[17.375rem] rounded-[1.25rem] pt-[4.5rem]"
    >
      <CardHeader>
        {post.chip === "new" && (
          <Label variant="new" className="absolute -top-11">
            NEW
          </Label>
        )}
        {post.chip === "hot" && <Label className="absolute -top-11">HOT</Label>}
        <CardTitle weight="bold">
          {post.title?.translated ||
            post.title?.original ||
            "제목을 불러오는 데 실패했습니다."}
        </CardTitle>
      </CardHeader>
      <CardSubTitle
        size="big"
        isSingleLine
        className="block truncate font-medium"
      >
        {renderPostContent(post)}
      </CardSubTitle>
      <CardFooter>
        <div className="inline-flex gap-[0.625rem]">
          <ScrapButton pinnedInfo={pinnedInfo} isScrapped={post.isScrapped} />
          <ShareButton postId={post.id} />
        </div>
        <CardSubTitle className="font-medium">
          {post.created_at
            ? formatTimestampAsDaysAgo(post.created_at)
            : "작성일을 불러오는 데 실패했습니다."}
        </CardSubTitle>
      </CardFooter>
    </Card>
  );
}
