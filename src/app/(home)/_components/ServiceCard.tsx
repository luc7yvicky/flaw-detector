import Image from "next/image";
import { Card, CardContent, CardSubTitle } from "../../../components/ui/Card";
import { ServiceLabel, ServiceLabelProps } from "../../../components/ui/Label";

export type ServiceVariants = {
  variant:
    | "security"
    | "critical"
    | "realtime"
    | "privacy"
    | "efficiency"
    | "quick";
};

export type ServiceInfo = {
  color: ServiceLabelProps["color"];
  title: string;
  descriptions: [string, string];
  image: string;
};

const serviceCardDetails: Record<ServiceVariants["variant"], ServiceInfo> = {
  security: {
    color: "pink",
    title: "보안 강화",
    descriptions: ["보안 취약점 사전 식별 후 해결", "소프트웨어 보안성 강화"],
    image: "/images/lockedWithKey.png",
  },
  critical: {
    color: "green",
    title: "미션 크리티컬한 개발에 적합",
    descriptions: ["미션 크리티컬한 개발 특별 제작", "안전한 솔루션 제공"],
    image: "/images/gear.png",
  },
  realtime: {
    color: "purple",
    title: "실시간 보안 업데이트",
    descriptions: [
      "최신 보안 동향 및 취약점 정보 실시간 제공",
      "개발자 보안 강화를 도움",
    ],
    image: "/images/lockedWithPen.png",
  },
  privacy: {
    color: "blue",
    title: "사용자 데이터 보호",
    descriptions: [
      "데이터 무단 액세스 및 정보 유출 방지",
      "개인 정보 안전하게 보호",
    ],
    image: "/images/stopHand.png",
  },
  efficiency: {
    color: "yellow",
    title: "효율적인 개발",
    descriptions: ["보안 취약점 자동 분석 후 수정", "개발 집중 및 생산성 향상"],
    image: "/images/circularArrows.png",
  },
  quick: {
    color: "red",
    title: "신속한 대응과 수정",
    descriptions: ["발견된 취약점 대응 및 수정", "안전한 소프트웨어 개발 가능"],
    image: "/images/checkMark.png",
  },
};

export default function ServiceCard({
  variant,
  className,
}: ServiceVariants & { className?: string }) {
  const { color, title, descriptions, image } = serviceCardDetails[variant];

  return (
    <Card variant="service" size="service" className={className}>
      <ServiceLabel color={color}>{title}</ServiceLabel>
      <CardContent variant="emoji" bgColor="transparent">
        <Image
          src={image}
          alt="service emoji"
          width={120}
          height={180}
          style={{ width: 120, height: 180 }}
        />
      </CardContent>
      <div className="flex-col-center-center gap-y-1">
        {descriptions.map((description, index) => (
          <CardSubTitle color="#606060" key={index}>
            {description}
          </CardSubTitle>
        ))}
      </div>
    </Card>
  );
}
