// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   startAt,
//   endAt,
// } from "firebase/firestore";
// import db from "../../../../firebaseConfig";
// import { VulDBPostWithChip } from "@/types/post";

// export default function SearchResult() {
//   const router = useRouter();
//   const { query: searchParams } = router;
//   const searchText = searchParams.query || "";
//   const [searchResults, setSearchResults] = useState<VulDBPostWithChip[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchResults = async () => {
//       if (!searchText) return;
//       setLoading(true);
//       try {
//         const searchQuery = query(
//           collection(db, "posts"),
//           orderBy("title.translated"),
//           startAt(searchText),
//           endAt(searchText + "\uf8ff"),
//         );
//         const querySnapshot = await getDocs(searchQuery);
//         const results: VulDBPostWithChip[] = querySnapshot.docs.map(
//           (doc) => doc.data() as VulDBPostWithChip,
//         );
//         setSearchResults(results);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [searchText]);

//   if (loading) {
//     return <div>로딩 중...</div>;
//   }

//   if (!searchResults.length) {
//     return <div>검색 결과가 없습니다.</div>;
//   }

//   return (
//     <div>
//       <ul>
//         {searchResults.map((result, index) => (
//           <li key={index}>{result.title.translated}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

// import Button from "@/components/common/Button";
// import { PostDataType } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { IoIosArrowBack } from "react-icons/io";
// import MainPostCardList from "../_components/mainPostCard/MainPostCardList";
// import VuldbPagination from "../_components/VuldbPagiNation";
import VulDBImageCardContainer from "@/components/vulnerability-db/VulDBImageCardContainer";
import { VulDBPost } from "@/types/post";
import Button from "@/components/ui/Button";
import { getAllPosts } from "@/lib/api/posts";
import { applyChips } from "@/app/(posts)/vuldb/items/page";
import { Timestamp } from "firebase/firestore";
import { SessionProvider } from "next-auth/react";

export default function SearchResult() {
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState<VulDBPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // 페이지 상태 관리
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const ITEMS_PER_PAGE = 5;
  const [totalItems, setTotalItems] = useState(0); // 총 게시글 수
  const [top3RecentPosts, setTop3RecentPosts] = useState<VulDBPost[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!query) return;
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch(
  //         `/api/vuldb/search?query=${encodeURIComponent(query)}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
  //       );
  //       const data = await res.json();
  //       // console.log("page.tsx", data);
  //       // console.log("Fetching data for page:", currentPage); // 데이터 가져올 때 로그 추가
  //       if (data.results && data.results.length > 0) {
  //         setSearchResults(data.results);
  //         setTotalItems(data.totalItems); // 서버에서 총 아이템 수를 받는다고 가정
  //       } else {
  //         setSearchResults([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [query, currentPage]); // currentPage가 변경될 때마다 데이터를 다시 불러옴

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/test/search?query=${encodeURIComponent(query)}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        );
        const data = await res.json();

        // 추가한 로그
        console.log("응답 데이터:", data);

        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setTotalItems(data.totalItems);

          // 여기서 전체 게시물 가져오기
          const posts = (await getAllPosts()) || [];
          if (posts.length > 0) {
            const postsWithChips = applyChips(posts);

            // 최신 게시물을 created_at 기준으로 정렬 + 동일한 created_at일 경우 id 기준 정렬
            const sortedPostsByDate = postsWithChips.sort((a, b) => {
              const dateA = new Timestamp(
                a.created_at.seconds,
                a.created_at.nanoseconds,
              ).toDate();
              const dateB = new Timestamp(
                b.created_at.seconds,
                b.created_at.nanoseconds,
              ).toDate();

              return dateB.getTime() === dateA.getTime()
                ? a.id.localeCompare(b.id)
                : dateB.getTime() - dateA.getTime();
            });

            // 상위 3개의 게시물만 가져오기
            setTop3RecentPosts(sortedPostsByDate.slice(0, 3));
          }
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, currentPage]); // currentPage가 변경될 때마다 데이터를 다시 불러옴

  return (
    <section className="relative flex w-full flex-col gap-4">
      <div
        className={`flex flex-col gap-4 ${!session ? "pointer-events-none blur-[10px]" : ""}`}
      >
        <div className="mb-[28px] flex cursor-pointer flex-row items-center gap-3">
          <Link href={"/test"}>
            {/* <IoIosArrowBack className="h-[31px] w-[31px] text-gray-300 hover:text-gray-700" /> */}
          </Link>
          <h1 className="text-[28px] font-semibold">
            &lsquo;{query}&lsquo;의 검색결과
          </h1>
        </div>
        {searchResults.length > 0 ? (
          <VulDBImageCardContainer posts={top3RecentPosts} />
        ) : (
          <div className="mt-[200px] flex w-full flex-col items-center gap-4">
            <h1 className="text-3xl font-semibold">
              취약점DB에 검색한 결과가 없어요.
            </h1>
            <p className="text-xl text-gray-400">
              다른 주제로 다시 검색해 보세요.
            </p>
          </div>
        )}
      </div>
      {!session && (
        <div className="shadow-custom-shadow dark:border-primary-purple-500 dark:bg-custom-dark-bg absolute left-1/2 top-0 z-10 flex h-[210px] w-[341px] -translate-x-1/2 translate-y-1/2 transform flex-col items-center justify-center gap-7 rounded-[20px] bg-white py-10 dark:border">
          <p className="text-xl font-medium">자세한 정보를 보고 싶다면?</p>
          <Link href="/login">
            <Button
              className="border-primary-purple-500 h-[74px] w-[119px] border-2"
              // theme="outlined"
              // size="middle"
              // isRound
            >
              Login
            </Button>
          </Link>
        </div>
      )}

      {/* {session && searchResults.length > 0 && (
        <VuldbPagination
          totalItems={totalItems}
          current={currentPage} // 현재 페이지 상태 전달
          setCurrent={setCurrentPage} // 상태 업데이트 함수 전달
          numberPerPage={ITEMS_PER_PAGE}
        />
      )} */}
    </section>
  );
}
