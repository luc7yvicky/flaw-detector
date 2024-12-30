import { cn, formatTimestampAsDateTime } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { StaticImageData } from "next/image";
import Link from "next/link";
import {
  Card,
  CardCoverImage,
  CardFooter,
  CardLinkButton,
  CardSubTitle,
  CardTitle,
} from "@/components/ui/Card";
import { CardProps, CardTitleProps } from "@/types/card";

type VulDBLatestPost = {
  id: string;
  title: { original: string; translated: string };
  created_at: Timestamp;
};

type cardStyles = {
  cardSize: "main" | "sub";
  imageSrc: StaticImageData;
  titleSize: "big" | "xsmall";
  subtitleSize: "big" | "default";
  titleWrapperWidth: "w-[27.5rem]" | "w-[8.5rem]";
};

type ImageCardProps = VulDBLatestPost & cardStyles;

export default function ImageCard({
  cardData,
  onMouseOverCard,
  onMouseOutCard,
  cardSize,
  cardTitleSize,
  cardSubtitleSize,
  cardTitleWrapperWidth,
}: {
  cardData: ImageCardProps;
  onMouseOverCard: () => void;
  onMouseOutCard: () => void;
  cardSize: CardProps["size"];
  cardTitleSize: CardTitleProps["size"];
  cardSubtitleSize: CardTitleProps["size"];
  cardTitleWrapperWidth: string;
}) {
  const dateTime = cardData.created_at
    ? formatTimestampAsDateTime(cardData.created_at)
    : "날짜 정보 없음";

  return (
    <Card
      key={cardData.id}
      variant="image"
      size={cardSize}
      onMouseOver={onMouseOverCard}
      onMouseOut={onMouseOutCard}
      className="transition-all duration-300 hover:cursor-pointer"
    >
      <CardCoverImage
        src={cardData.imageSrc}
        alt={`미리보기 이미지: ${cardData.title.translated || cardData.title.original}`}
      />
      <CardFooter className="items-end">
        <div
          className={cn(
            "flex flex-col justify-end gap-y-[0.625rem]",
            cardTitleWrapperWidth,
          )}
        >
          <CardTitle
            size={cardTitleSize}
            weight="bold"
            color="white"
            className="block overflow-visible text-clip whitespace-normal"
          >
            {cardData.title?.translated ||
              cardData.title?.original ||
              "제목 없음"}
          </CardTitle>
          <CardSubTitle size={cardSubtitleSize}>{dateTime}</CardSubTitle>
        </div>
        <Link href={`/vuldb/items/${cardData.id}`} passHref legacyBehavior>
          <CardLinkButton aria-label="취약점 상세 게시글 페이지로 이동" />
        </Link>
      </CardFooter>
    </Card>
  );
}
