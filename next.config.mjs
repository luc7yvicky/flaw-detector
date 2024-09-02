/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
    ],
  },
  staticPageGenerationTimeout: 200, // 타임아웃 시간을 200초로 연장 (크롤링 작업을 functions 서비스로 분리하기 전까지 임시 설정)
};

export default nextConfig;
