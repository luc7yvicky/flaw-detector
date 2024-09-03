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
import {
  VUL_DB_POSTS_API_URL,
  WEB_CRAWLING_CERT_CC_API_URL,
} from "@/lib/const";
import { cn, formatTimestampAsDateTime } from "@/lib/utils";
import {
  CertCCContent,
  CertCCLocalizedTextBlock,
  CertCCTextBlock,
  VulDBPost,
} from "@/types/type";
import { isCertCCContentType } from "@/types/typeGuards";
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

async function getGeneratedText(user_message: string) {
  const res = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    body: JSON.stringify({
      user_message,
      temperature: 0.9,
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    throw new Error(`생성 실패 (status code: ${res.status})`);
  }

  const data = await res.json();
  return data;
}

async function getCertCCWebScrawlingData() {
  const res = await fetch(WEB_CRAWLING_CERT_CC_API_URL, {
    method: "GET",
  });
  if (!res.ok) {
    console.log("res", res);
  }
  const data = await res.json();
  return data;
}

export default async function VulDBPage() {
  const posts = await getAllVulDBPosts();
  const certCCData = await getCertCCWebScrawlingData();

  if (!posts || !certCCData) {
    return <div>Error loading data</div>;
  }

  // console.log("certCCData", certCCData);

  const translateText = async (originalText: string) => {
    const res = await getGeneratedText(
      `다음 텍스트를 번역해주세요. ${originalText}`,
    );
    return res.generated_text;
  };

  const translateContent = async (content: VulDBPost["content"]) => {
    const translateSection = async (section: CertCCLocalizedTextBlock) => {
      return Promise.all(
        section.original.map(async (item: CertCCTextBlock) => ({
          ...item,
          text: await translateText(item.text),
        })),
      );
    };

    if (!isCertCCContentType(content)) {
      return;
    }

    return {
      overview: {
        original: content.overview.original,
        translated: await translateSection(content.overview),
      },
      description: {
        original: content.description.original,
        translated: await translateSection(content.description),
      },
      impact: {
        original: content.impact.original,
        translated: await translateSection(content.impact),
      },
      solution: {
        original: content.solution.original,
        translated: await translateSection(content.solution),
      },
      cveIDs: content.cveIDs,
    };
  };

  const translatedPosts = await Promise.all(
    certCCData.posts.map(async (post: VulDBPost) => {
      const originalTitle = post.title.original;
      const translatedTitle = await translateText(originalTitle);
      const translatedContent = await translateContent(post.content);

      return {
        ...post,
        title: { original: originalTitle, translated: translatedTitle },
        content: translatedContent,
      };
    }),
  );

  return (
    <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
      <div className="mx-auto mb-[1.188rem] mt-[1.688rem] flex w-[82.063rem] flex-col gap-[4.75rem]">
        {translatedPosts.map((post) => {
          return (
            <div key={post.id}>
              <h2>{post.title.translated}</h2>
              <div>
                {post.content.overview.translated.map((t: any) => {
                  console.log(t);
                  return t.text;
                })}
              </div>
              <div>
                {post.content.description.translated.map((t: any) => t.text)}
              </div>
              <div>
                {post.content.impact.translated.map((t: any) => t.text)}
              </div>
              <div>
                {post.content.solution.translated.map((t: any) => t.text)}
              </div>
            </div>
          );
        })}
        <VulDBImageCardContainer posts={posts.data} />
        <VulDBDashboard posts={posts.data} /> {/* 취약점 DB & 실시간 Topic */}
      </div>
      <VulDBImageCardContainer posts={posts.data} />
      <VulDBDashboard posts={posts.data} /> {/* 취약점 DB & 실시간 Topic */}
    </div>
  );
}
