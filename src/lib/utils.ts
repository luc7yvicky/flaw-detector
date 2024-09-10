import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/** Firestore의 timestamp 형식에서 Date 객체로 변환합니다. */
const convertTimestampToDate = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): Date => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

/** Firestore의 timestamp 형식에서 문자열('#일 전')로 변환합니다.*/
export const formatTimestampAsDaysAgo = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): string => {
  const createdAtDate = convertTimestampToDate(timestamp);
  const now = new Date();

  // 두 날짜 간의 차이 계산 (밀리초 단위)
  const differenceInMs = now.getTime() - createdAtDate.getTime();

  // 차이를 일 단위로 변환
  const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return `${daysAgo}일 전`;
};

/** Firestore의 timestamp 형식에서 문자열('YYYY.MM.DD HH:mm:ss')로 변환합니다. */
export const formatTimestampAsDateTime = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): string => {
  const date = convertTimestampToDate(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

/** ISO 8601 형식(YYYY-MM-DDtHH:mm:ss)에서 문자열('YY.MM.DD')로 변환합니다. */
export const formatDatetimeToYYMMDD = (datetime: string) => {
  const date = new Date(datetime);
  const YY = date.getFullYear().toString().slice(2);
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");

  return `${YY}.${MM}.${DD}`;
};

/* 선택한 파일의 확장자로 작성 언어를 리턴하여 코드 하이라이터의 속성으로 사용합니다*/
export const getLanguage = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "py":
      return "python";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "java":
      return "java";
    case "jsp":
      return "jsp";
    case "c":
      return "c";
    case "cpp":
    case "cxx":
    case "cc":
    case "c++":
      return "cpp";
    case "cs":
      return "csharp";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "swift":
      return "swift";
    case "kt":
    case "kts":
      return "kotlin";
    case "r":
      return "r";
    case "sh":
      return "bash";
    case "xml":
      return "xml";
    case "yml":
    case "yaml":
      return "yaml";
    case "sql":
      return "sql";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "tiff":
    case "svg":
      return "image";
    // 확장자-언어 추가 가능
    default:
      return "javascript";
  }
};

/* 폴더 -> 파일 순 정렬 */
export const sortDirectoryFirst = (
  data: Array<{ name: string; type: "dir" | "file" | "submodule" | "symlink" }>,
): Array<{ name: string; type: "dir" | "file" | "submodule" | "symlink" }> => {
  const sortedData = data.sort((a, b) => {
    if (a.type === "dir" && b.type !== "dir") {
      return -1;
    }

    // 나머지 경우는 원래 순서 유지
    return 0;
  });

  return sortedData;
};

/* json으로 파싱되기 전 문자열에 포함되어 있는 정규식, 작은따옴표 처리 */
export const convertEscapedCharacterToRawString = (str: string) => {
  let rawString;

  // 정규식 문자열을 두 개의 백슬래시로 감싸주기
  rawString = str.replace(/\/([^\/]+)\/g/g, "\\\\/$1\\\\/g");

  // 싱글 쿼테이션을 앞에 백슬래시 + 더블 쿼테이션 조합으로 대체
  rawString = rawString.replace(/'/g, `\\"`);

  // 슬래시 + 더블 쿼테이션을 앞에 슬래시 + 백슬래시 + 더블 쿼테이션 조합으로 대체
  rawString = rawString.replace(/\/"/g, `/\\"`);

  return rawString;
};
