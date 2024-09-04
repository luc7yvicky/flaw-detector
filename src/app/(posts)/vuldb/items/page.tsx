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

// Firebase -------------------------------------------------------------------
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

// async function addVulDBPost(post: VulDBPost) {
//   const res = await fetch(VUL_DB_POSTS_API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ post }),
//   });

//   if (!res.ok) {
//     throw new Error("post 추가하기 실패");
//   }

//   const data = await res.json();
//   return data;
// }

// Web Crawling ---------------------------------------------------------------
// async function getCertCCWebScrawlingData() {
//   const res = await fetch(WEB_CRAWLING_CERT_CC_API_URL, {
//     method: "GET",
//   });
//   if (!res.ok) {
//     console.log("res", res);
//   }
//   const data = await res.json();
//   return data;
// }

// Translation ----------------------------------------------------------------
// async function getGeneratedText(user_message: string) {
//   const LOCAL_LLAMA_API_URL = "http://localhost:3000/api/generate";
//   const res = await fetch(LOCAL_LLAMA_API_URL, {
//     method: "POST",
//     body: JSON.stringify({
//       user_message,
//       temperature: 0.9,
//       top_p: 0.9,
//     }),
//   });

//   if (!res.ok) {
//     throw new Error(`생성 실패 (status code: ${res.status})`);
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
  // const certCCData = await getCertCCWebScrawlingData();

  // if (!posts || !certCCData) {
  //   return <div>Error loading data</div>;
  // }

  // console.log("certCCData", certCCData);

  // const translateText = async (originalText: string) => {
  //   const res = await getGeneratedText(
  //     `다음 텍스트를 번역해주세요. CVE 번호와 url등은 제외하고 이어서 번역해주세요. ${originalText}`,
  //   );
  //   return res.generated_text;
  // };

  // const translateSection = async (section: CertCCLocalizedTextBlock) => {
  //   if (!section || !section.original || section.original.length === 0) {
  //     return section ? { original: [], translated: [] } : null;
  //   }

  //   return Promise.all(
  //     section.original.map(async (item: CertCCTextBlock) => ({
  //       ...item,
  //       text: await translateText(item.text),
  //     })),
  //   );
  // };

  // const translateContent = async (content: VulDBPost["content"]) => {
  //   if (!isCertCCContentType(content)) {
  //     return;
  //   }

  //   return {
  //     overview: {
  //       original: content.overview.original,
  //       translated: await translateSection(content.overview),
  //     },
  //     description: {
  //       original: content.description.original,
  //       translated: await translateSection(content.description),
  //     },
  //     impact: {
  //       original: content.impact.original,
  //       translated: await translateSection(content.impact),
  //     },
  //     solution: {
  //       original: content.solution.original,
  //       translated: await translateSection(content.solution),
  //     },
  //     cveIDs: content.cveIDs,
  //   };
  // };

  // const translatedPosts = await Promise.all(
  //   certCCData.posts.map(async (post: VulDBPost) => {
  //     const originalTitle = post.title.original;

  //     const translatedTitle = await translateText(originalTitle);
  //     const translatedContent = await translateContent(post.content);

  //     return {
  //       ...post,
  //       title: { original: originalTitle, translated: translatedTitle },
  //       content: translatedContent,
  //     };
  //   }),
  // );

  // console.log(translatedPosts);

  // if (translatedPosts) {
  //   translatedPosts.map(async (post: VulDBPost) => {
  //     return await addVulDBPost(post);
  //   });
  // }

  return (
    <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
      <VulDBImageCardContainer posts={posts.data} />
      <VulDBDashboard posts={posts.data} /> {/* 취약점 DB & 실시간 Topic */}
    </div>
  );
}
