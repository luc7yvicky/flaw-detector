"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  updateDoc,
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import db from "../../../../firebaseConfig";
import { IconMagnifierWithPlus } from "@/components/ui/Icons";
import { VulDBPostWithChip } from "@/types/post";

interface SearchBarProps {
  initialQuery?: string;
  initialPosts: VulDBPostWithChip[]; // 추가
}

export default function SearchBar({ initialQuery }: { initialQuery?: string }) {
  const [searchText, setSearchText] = useState(initialQuery || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // // 외부 클릭 감지
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchBarRef.current &&
  //       !searchBarRef.current.contains(event.target as Node)
  //     ) {
  //       setIsFocused(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchText(query);
    }
  }, [searchParams]);

  const saveSearchKeyword = async (text: string): Promise<void> => {
    try {
      const searchRef = doc(collection(db, "search"), text);
      const searchDoc = await getDoc(searchRef);

      if (searchDoc.exists()) {
        const currentViews = searchDoc.data().views || 0;
        await updateDoc(searchRef, {
          views: currentViews + 1,
          update_at: serverTimestamp(),
        });
      } else {
        await setDoc(searchRef, {
          text,
          views: 1,
          create_at: serverTimestamp(),
          update_at: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error saving search keyword:", error);
    }
  };

  const fetchSuggestions = useCallback(async (text: string) => {
    if (text.trim().length < 2) {
      setSuggestions([]); // 최소 입력 길이 체크
      return;
    }

    const cleanText = text.replace(/\s+/g, ""); // 공백 제거

    const searchQueryTitle = query(
      collection(db, "posts"),
      orderBy("title.translated"),
      startAt(cleanText),
      endAt(cleanText + "\uf8ff"),
    );

    // content.introduction.original 필드 검색 쿼리
    const searchQueryIntro = query(
      collection(db, "posts"),
      orderBy("content.introduction.original"),
      startAt(cleanText),
      endAt(cleanText + "\uf8ff"),
    );

    // content.description.original 필드 검색 쿼리
    const searchQueryDesc = query(
      collection(db, "posts"),
      orderBy("content.description.original"),
      startAt(cleanText),
      endAt(cleanText + "\uf8ff"),
    );

    // content.vulnDetail.original 필드 검색 쿼리
    const searchQueryVuln = query(
      collection(db, "posts"),
      orderBy("content.vulnDetail.original"),
      startAt(cleanText),
      endAt(cleanText + "\uf8ff"),
    );

    //   const querySnapshot = await getDocs(searchQuery);
    //   const suggestionList: string[] = [];
    //   querySnapshot.forEach((doc) => {
    //     suggestionList.push(doc.data().title.translated);
    //   });

    //   setSuggestions(suggestionList);
    // }, []);

    // 모든 쿼리를 병렬적으로 실행
    const [titleSnapshot, introSnapshot, descSnapshot, vulnSnapshot] =
      await Promise.all([
        getDocs(searchQueryTitle),
        getDocs(searchQueryIntro),
        getDocs(searchQueryDesc),
        getDocs(searchQueryVuln),
      ]);

    const suggestionList: string[] = [];

    // title.translated 검색 결과 추가
    titleSnapshot.forEach((doc) => {
      suggestionList.push(doc.data().title.translated);
    });

    // content.introduction.original 검색 결과 추가
    introSnapshot.forEach((doc) => {
      suggestionList.push(doc.data().content.introduction.original);
    });

    // content.description.original 검색 결과 추가
    descSnapshot.forEach((doc) => {
      suggestionList.push(doc.data().content.description.original);
    });

    // content.vulnDetail.original 검색 결과 추가
    vulnSnapshot.forEach((doc) => {
      suggestionList.push(doc.data().content.vulnDetail.original);
    });

    setSuggestions(suggestionList);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchText(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 300);
  };

  const handleSearch = () => {
    if (searchText.trim().length < 2) {
      alert("검색어를 입력해주세요.");
      return;
    }

    router.push(`/test/search?query=${encodeURIComponent(searchText)}&page=1`);
    setSuggestions([]);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchText(suggestion);
    handleSearch(); // 선택 시 바로 검색 실행
  };

  return (
    <div ref={searchBarRef} className="relative">
      <div className="flex w-full items-center">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          className="flex-grow border-none text-2xl font-medium outline-none"
        />
        <button onClick={handleSearch}>
          <IconMagnifierWithPlus />
        </button>
      </div>
      {suggestions.length > 0 && isFocused && (
        <ul className="absolute top-[72px] z-40 w-full bg-white">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)} // 클릭 시 검색 실행
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
