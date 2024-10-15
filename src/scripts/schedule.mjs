import startCertCCWebCrawling from "./crawling.mjs";
import { addVulDBPost } from "./firebase.mjs";
import translatePost from "./translate.mjs";

export default async function crawling() {
  try {
    console.log("웹 크롤링을 시작합니다...");
    const posts = await startCertCCWebCrawling();
    console.log(
      `웹 크롤링이 완료되었습니다. 총 ${posts.length}개의 게시물을 수집했습니다.`,
    );

    if (posts.length === 0) {
      console.log("게시물이 없습니다. 크롤링을 종료합니다.");
      return;
    }

    // console.log("번역을 시작합니다...");
    // const translatedPosts = await translatePost(posts);
    // console.log("번역이 완료되었습니다.");

    console.log("게시글을 Firestore에 추가합니다...");
    // await addPostsToFirestore(translatedPosts);
    await addPostsToFirestore(posts);
    console.log(
      "모든 게시글이 Firestore에 성공적으로 추가되었습니다. 함수를 종료합니다.",
    );
  } catch (error) {
    console.error("오류가 발생했습니다:", error);
  }
}

const addPostsToFirestore = async (posts) => {
  if (posts) {
    await Promise.all(
      posts.map(async (post) => {
        await addVulDBPost(post);
        // console.log(`게시글이 Firestore에 추가되었습니다: ${post.id}`);
      }),
    );
  }
};

crawling();
