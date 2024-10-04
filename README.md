## 목차

1. [**프로젝트 소개**](#1)
2. [**기술 스택**](#2)
3. [**주요 기능**](#3)
4. [**아키텍처**](#4)
5. [**팀 소개**](#5)
6. [**성능 최적화**](#6)
7. [**폴더 구조**](#7)

<div id="1"></div>

## 📌 프로젝트 소개

![main](https://github.com/user-attachments/assets/dc282e55-adee-413a-a058-a53d95bf0dde)

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
</div>

<div style="display: flex; gap:5px;">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Puppeteer-2E8555?style=for-the-badge&logo=Puppeteer&logoColor=white" />  
  <img src="https://img.shields.io/badge/NextAuth-181717?style=for-the-badge&logo=nextdns&logoColor=white" />
  <img src="https://img.shields.io/badge/octokit-181717?style=for-the-badge&logo=github&logoColor=white" />
</div>

### Generative AI

   <img src="https://img.shields.io/badge/llama3-white?style=for-the-badge&logo=meta&logoColor=black" />

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

### 1. 취약점 코드 검사 및 분석 기능

#### 1.1. 로그인 사용자가 선택한 github 레포지토리의 코드 취약점 분석

![image](https://github.com/user-attachments/assets/e068a4e4-82a2-4239-97c6-716a8dd44d1b)

### 1.2. 코드 취약점 분석 기능

#### 1.2.1. 레포지토리 전체 검사

![image](https://github.com/user-attachments/assets/658f478a-b5b1-4d20-86c1-a00cf9114563)

#### 1.2.2. 특정 파일 검사 중 선택 가능

![image](https://github.com/user-attachments/assets/b8b9f9e5-318c-4e21-a98e-689ce61ca68f)

### 1.3. 검사 진행 상황과 결과 요약 실시간으로 확인 가능

![image](https://github.com/user-attachments/assets/2da1066c-64b1-4a88-a2f3-7a9c3b189990)
![image](https://github.com/user-attachments/assets/30b90728-d84a-41b9-9117-7394d1222061)


### 2. 보안 취약점 DB

#### 2.1. 크롤링한 보안 취약점 기사 제공

#### 2.1.1. 로그인 전

![image](https://github.com/user-attachments/assets/9bca259b-5a33-4926-a477-00224a1f01f9)

#### 2.1.2. 로그인 후

- 인기 게시글, 최신 게시글 필터 기능
- 실시간 Topic : 매 정시에 상위 10개 인기 검색어 업데이트
  ![image](https://github.com/user-attachments/assets/6d1d7496-9607-473d-9043-710a05c0c7ab)

#### 2.2. 게시글 조회 기능

- [CNNVD](https://www.cnnvd.org.cn/home/childHome) 및 [CERT/CC](https://www.kb.cert.org/vuls/)에서 크롤링한 보안 취약점 기사 제공
- 비슷한 정보글 : 최신 게시글 기반 추천 기능
  ![image](https://github.com/user-attachments/assets/5f5e2674-5c20-4ab6-b7f6-4fda50dbd883)

- 게시글 스크랩 기능
  ![image](https://github.com/user-attachments/assets/ec6f14d7-15e3-4c35-8d2b-2878b6158bf7)

- 게시물 공유 기능
  ![image](https://github.com/user-attachments/assets/3d1511e7-ac93-4bd7-8661-8ade1905c55f)

### 3. Profile Information

#### 3.1. 깃허브 연동 계정 확인 및 로그아웃

![image](https://github.com/user-attachments/assets/9d8666cf-8cb6-4f73-83b0-3e0f0b2fda52)
![image](https://github.com/user-attachments/assets/d8515336-40c8-4f0a-a4a1-369a92d51ee4)

#### 3.2. 스크랩한 게시글 조회

![image](https://github.com/user-attachments/assets/2689353e-b399-47cd-9841-4c3218dd0d4a)

#### 3.3. 고객센터 문의 메일 발송

![image](https://github.com/user-attachments/assets/4e95e8ec-fcee-4da4-b436-2f530c0674eb)
![image](https://github.com/user-attachments/assets/e5fa003e-a3e1-4158-ba69-cc7d929b1914)

<div id="4"></div>

## 📌 아키텍처

![image](https://github.com/user-attachments/assets/5a63edf0-3b6f-4f8d-9dd3-95b5ca403f3b)

<div id="5"></div>

## 📌 팀 소개

|                  이름                  |                                  <div align="center">개발 내용</div>                                   |
| :------------------------------------: | :----------------------------------------------------------------------------------------------------: |
| [심정아](https://github.com/joanShim)  |              프로젝트 세팅, 깃허브 API 연동, 레포지토리 파일 리스트, 파일 선택, 코드뷰어               |
|  [김다솔](https://github.com/sol-ee)   |                          파이어베이스 환경설정, 취약점 DB 웹크롤링, 공유기능                           |
| [유지수](https://github.com/jadugamja) |                      취약점 분석 검사 기능, 생성형 AI 프롬프팅, 깃허브 SNS 로그인                      |
| [유의진](https://github.com/timetam24) | 취약점 DB 웹크롤링 및 크롤링 자동화, 게시글 필터 및 스크랩 기능, 실시간 Topic, 비슷한 정보글, 고객센터 |

<div id="6"></div>

## 📌 성능 최적화

|                                                       BEFORE                                                       |                                                                                                                 AFTER                                                                                                                 |
| :----------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/9c1ead14-31d3-42a4-9e91-e59dd4346bfa" alt="성능최적화 이전"/> | <img src="https://cdn.discordapp.com/attachments/1268130742664171592/1288002574342946846/2024-09-24_2.02.18.png?ex=66f3995f&is=66f247df&hm=2a93e20b7ba596743728d3e7d8db5a8bba5999752c9e089aae67d6d81409e973&" alt="성능최적화 이후"/> |

<!-- 리팩토링 세부내용 추가 -->

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
