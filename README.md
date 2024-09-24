## 목차

1. [**프로젝트 소개**](#1)
2. [**기술 스택**](#2)
3. [**주요 기능**](#3)
4. [**아키텍처**](#4)
5. [**팀 소개**](#5)
6. [**폴더 구조**](#6)

<div id="1"></div>

## 📌 프로젝트 소개

![main](https://github.com/WePlanPlans/WPP_FE/assets/39702832/6b64523f-d3e9-4de2-b23b-a7bd35d0a4b8)

- **소개**

  - AI를 통해 취약점을 분석하고 해결책을 제공하는 보안 솔루션 시스템, **FlawDetector**<br/>

  - [**서비스 바로가기 Click !**](https://flaw-detector.vercel.app/) 👈

- **깃허브 레포**

  - [FE Github](https://github.com/luc7yvicky/flaw-detector) 👈

- **설치 및 실행**
  ```bash
  https://github.com/luc7yvicky/flaw-detector.git
  cd flaw-detector
  pnpm install
  pnpm run dev
  ```
  [http://localhost:3000](http://localhost:3000) 에서 확인 가능합니다.

<div id="2"></div>

## 📌 기술 스택

### Environment

<div style="display: flex; gap:5px;">
  <img src="https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220" />

  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" />
</div>

### FrontEnd

<div style="display: flex; gap:5px; margin-bottom:5px;">
  <img src="https://img.shields.io/badge/next.js-%2320232a?style=for-the-badge&logo=nextdotjs&logoColor=%ffffff" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img src="https://img.shields.io/badge/-Tanstack%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />

</div>

<div style="display: flex; gap:5px;">
<img src="https://img.shields.io/badge/Puppeteer-2E8555?style=for-the-badge&logo=Puppeteer&logoColor=white" />  
  <img src="https://img.shields.io/badge/NextAuth-181717?style=for-the-badge&logo=nextdns&logoColor=white" />
  <img src="https://img.shields.io/badge/octokit-181717?style=for-the-badge&logo=github&logoColor=white" />
</div>

### Database

<div style="display: flex; gap:5px;">
  <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=eslint&logoColor=white" />
</div>

### Managing & Communication

<div style="display: flex; gap:5px;">
  <img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white" />
  <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" />
  <img src="https://img.shields.io/badge/figma-%23F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white" />

</div>

<div id="3"></div>

## 📌 주요 기능

### 1. 코드 분석 기능

- 로그인 사용자가 선택한 github 레포지토리의 코드 취약점 분석
- 레포지토리 전체 검사 / 특정 파일 검사 중 선택 가능
- 검사 진행 상황과 결과 요약 실시간으로 확인 가능

### 2. 보안 취약점 DB

- 최신 보안 취약점 관련 기사(CNNVD, CERT/CC 크롤링 데이터)를 확인 ㄱ
- 조회수가 높은 게시글의 경우 HOT 라벨링, 48시간 이내 가져온 게시글은 NEW 라벨링
- 선택한 라벨(HOT / NEW)에 따른 게시글 필터링하여 출력
- 게시글 검색 및 조회 기능 제공
- 정시마다 검색 횟수가 많은 상위 10개 검색어 표시 (실시간 Topic)
- 게시글 스크랩과 공유 기능 제공
- 게시글 상세 페이지 하단에 최신 게시글 추천 목록 표시

<div id="4"></div>

## 📌 아키텍처

<div id="5"></div>

## 📌 팀 소개

|                 이름                  |        <div align="center">개발 내용</div>         |
| :-----------------------------------: | :------------------------------------------------: |
| [심정아](https://github.com/joanShim) |       취약점 분석 검사 기능, 깃허브 API 연동       |
|              [김다솔]()               |                 취약점 DB 웹크롤링                 |
|              [유지수]()               | 취약점 분석 검사 기능, 프롬프팅, 깃허브 SNS 로그인 |
|              [유의진]()               |        취약점 DB 웹크롤링, 웹 크롤링 자동화        |

<div id="7"></div>

## 📌 폴더 구조

<details>
<summary>폴더 구조 보기</summary>

```
── README.md
├── build.sh
├── firebase.json
├── firebaseConfig.ts
├── firestore.indexes.json
├── firestore.rules
├── functions
├── next-env.d.ts
├── next.config.mjs
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── fonts
│   ├── images
├── src
│   ├── app
│   │   ├── api
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth.config.ts
│   ├── auth.ts
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── middleware.ts
│   ├── stores
│   └── types
├── storage.rules
├── tailwind.config.ts
└── tsconfig.json

```

</details>

---

### ✅ 개발 기간 : `7주 - 24.08.05 ~ 24.09.20`
