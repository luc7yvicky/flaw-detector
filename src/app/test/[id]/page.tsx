// import { getPostById } from "@/lib/api/posts"; // 데이터를 가져오는 함수
// import { DocumentData } from "firebase/firestore"; // Firestore 관련 타입 import
// import ContentDisplay from "../_components/ContentDisplay";
// import { CertCCContent, CnnvdContent } from "@/types/post";

import RealTimeTopic from "@/components/vulnerability-db/RealTimeTopic";
import SearchBar from "../_components/SearchBar";
import SearchResult from "../_components/SearchResult";
import { SessionProvider } from "next-auth/react";

// type Props = {
//   params: {
//     id: string;
//   };
// };

// // post가 CertCCContent인지 CnnvdContent인지 확인하는 타입 가드 함수
// function isCertCCContent(post: DocumentData): post is CertCCContent {
//   return (post as CertCCContent).overview !== undefined;
// }

// export default async function PearPostPage({ params }: Props) {
//   const { id } = params;

//   try {
//     const post = await getPostById(id);

//     if (!post) {
//       return (
//         <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
//           해당 게시물을 찾을 수 없습니다.
//         </p>
//       );
//     }

//     // post를 CertCCContent 또는 CnnvdContent로 변환하여 ContentDisplay로 전달
//     if (isCertCCContent(post)) {
//       // CertCCContent일 경우
//       return (
//         <div className="relative mx-auto mb-[1.188rem] mt-[1.688rem] flex min-h-[2445px] w-[82.063rem] flex-col gap-[4.75rem] px-[1rem]">
//           <h1 className="text-3xl font-bold">CERT/CC Post</h1>
//           <ContentDisplay content={post} />
//         </div>
//       );
//     } else {
//       // CnnvdContent일 경우
//       const cnnvdPost = post as CnnvdContent;
//       return (
//         <div className="relative mx-auto mb-[1.188rem] mt-[1.688rem] flex min-h-[2445px] w-[82.063rem] flex-col gap-[4.75rem] px-[1rem]">
//           <h1 className="text-3xl font-bold">CNNVD Post</h1>
//           <ContentDisplay content={cnnvdPost} />
//         </div>
//       );
//     }
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return (
//       <p className="mx-auto mb-[1.188rem] mt-[1.688rem] w-[82.063rem] text-center text-2xl font-bold">
//         게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
//       </p>
//     );
//   }
// }

export default function VulnerabilityDb() {
  return (
    <main className="h-auto max-w-[1920px] px-6 py-9">
      <div className="mx-auto flex w-full max-w-[1313px] flex-col gap-[66px]">
        {/* <ImageCardList /> */}
        <div className="z-20">
          <SearchBar />
        </div>
        <div className="flex justify-between gap-4">
          <SessionProvider>
            <SearchResult />
          </SessionProvider>
          <RealTimeTopic />
        </div>
      </div>
    </main>
  );
}
