import CodeResultsListItem from "@/components/analyze/CodeResultsListItem";
import Button from "@/components/ui/Button";
import { FileResultProps } from "@/types/file";
import Image from "next/image";

export const DEMO_CODE_RESULTS: FileResultProps = {
  id: 1,
  name: "XSS (Cross-Site Scripting) Vulnerability",
  vulnerability:
    "사용자 입력을 HTML에 직접 삽입하면서 HTML을 안전하게 처리하지 않음.",
  severity: "High",
  descriptions: [
    "사용자 입력을 HTML에 삽입하기 전에 반드시 적절한 인코딩을 수행하거나, DOM API를 사용해 안전하게 요소를 삽입해야함.",
    "‘innerHTML’은 입력된 HTML 코드를 그대로 렌더링하기 때문에 악성 스크립트를 실행할 수 있음. ‘textContent’는 HTML을 해석하지 않고 텍스트로만 처리하기 때문에 안전함.",
  ],
  lines: "12-13",
  modified_codes: [
    "function displayUserInput(input) {",
    "  document.getElementById('userInput').textContent = input;",
    "}",
  ],
};

export default function DemoCodeViewer() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-full max-h-[23.725rem] w-full overflow-hidden">
        <Image
          src="/images/exampleCode.png"
          alt="example code"
          fill
          sizes="(min-width: 1024px) 100vw, 50vw"
          loading="lazy"
          quality={75}
        />
        <Button
          variant="demo"
          shape="rounded"
          className="top-[35%] translate-x-[25%]"
          aria-label="detected vulnerability"
        >
          🚨 {DEMO_CODE_RESULTS["name"]}
        </Button>
        <Button
          variant="demo"
          shape="rounded"
          className="top-[70%] translate-x-[140%]"
          aria-label="detected vulnerability"
        >
          🚨 Insecure Password Handling
        </Button>
      </div>
      <div className="mt-[1.71rem] flex flex-col gap-y-6">
        <CodeResultsListItem {...DEMO_CODE_RESULTS} />
      </div>
    </div>
  );
}
