import Button from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-[calc(100dvh-8.5rem)] items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg p-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
        <h2 className="mb-6 text-xl text-gray-700">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="mb-8 text-sm text-gray-500">
          요청하신 페이지가 삭제되었거나 잘못된 경로일 수 있습니다.
        </p>

        <div className="space-y-4">
          <Link href="/" passHref>
            <Button className="">홈으로 돌아가기</Button>
          </Link>

          <p className="text-sm text-gray-500">
            문제가 계속되면 고객센터로 문의해주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
