import {
  Card,
  CardCoverImage,
  CardFooter,
  CardLinkButton,
  CardProps,
  CardSubTitle,
  CardTitle,
  CardTitleProps,
  CardTitleWrapper,
} from "@/components/ui/Card";
import VulDBDashboard from "@/components/vulnerability-db/VulDBDashboard";
import { VUL_DB_POSTS_API_URL } from "@/lib/const";
import { cn, formatTimestampAsDateTime } from "@/lib/utils";
import { VulDBPost } from "@/types/type";
import Link from "next/link";

async function getAllVulDBPosts() {
  const res = await fetch(VUL_DB_POSTS_API_URL, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`posts 가져오기 실패`);
  }
  const data = await res.json();
  return data;
}

// async function addVulDBPost() {
//   const res = await fetch(VUL_DB_POSTS_API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ post: exampleCertCCVulDBPost }),
//   });

//   if (!res.ok) {
//     throw new Error("post 추가하기 실패");
//   }

//   const data = await res.json();
//   return data;
// }

function VulDBImageCardContainer({ posts }: { posts: VulDBPost[] }) {
  const newThreePosts = posts.slice(0, 3); // 최신에 수집된 3개 게시글 가져오기 (예정)
  const cardDatas = newThreePosts.map((item, index) => {
    const cardStyles = [
      {
        cardSize: "main",
        imageSrc: "/images/cardThumbnail1.png",
        titleSize: "big", // 28px
        subtitleSize: "big", // 20px
      },
      {
        cardSize: "sub",
        imageSrc: "/images/cardThumbnail2.png",
        titleSize: "xsmall", // 18px
        subtitleSize: "base", // 16px
      },
      {
        cardSize: "sub",
        imageSrc: "/images/cardThumbnail3.png",
        titleSize: "xsmall", // 18px
        subtitleSize: "base", // 16px
      },
    ];

    return { ...item, ...cardStyles[index] };
  });

  return (
    <div className="flex gap-7">
      {cardDatas.map((cardData) => {
        const firstCard = cardData.imageSrc === "/images/cardThumbnail1.png";
        const dateTime = formatTimestampAsDateTime(cardData.created_at);
        return (
          <Card
            key={cardData.id}
            variant="image"
            size={cardData.cardSize as CardProps["size"]}
          >
            <CardCoverImage
              src={cardData.imageSrc}
              alt={`미리보기 이미지: ${cardData.title.translated}`}
            />
            <CardFooter className="items-end">
              <CardTitleWrapper
                className={cn(firstCard ? "w-[27.5rem]" : "w-[8.5rem]")}
              >
                <CardTitle
                  size={cardData.titleSize as CardTitleProps["size"]}
                  weight="bold"
                  color="white"
                  className={cn(
                    "block overflow-visible text-clip whitespace-normal",
                    firstCard && "leading-[2.118rem]",
                  )}
                >
                  {cardData.title.translated}
                </CardTitle>
                <CardSubTitle
                  size={cardData.subtitleSize as CardTitleProps["size"]}
                >
                  {dateTime}
                </CardSubTitle>
              </CardTitleWrapper>
              <Link
                href={`/vuldb/items/${cardData.id}`}
                passHref
                legacyBehavior
              >
                <CardLinkButton />
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default async function VulDBPage() {
  const posts = await getAllVulDBPosts();

  return (
    <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
      <VulDBImageCardContainer posts={posts.data} />
      <VulDBDashboard posts={posts.data} /> {/* 취약점 DB & 실시간 Topic */}
    </div>
  );
}
