import os from "os";

/** 운영체제별로 Chrome 실행 파일 경로 찾기 */
export const getChromeExecutablePath = () => {
  const platform = os.platform();
  if (platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  } else if (platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (platform === "linux") {
    return "/usr/bin/google-chrome";
  } else if (platform === "freebsd") {
    return "/usr/local/bin/google-chrome";
  } else {
    throw new Error(`지원하지 않는 운영체제: ${platform}`);
  }
};
