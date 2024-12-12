import { InspectionList, RepoTree, RepoTreeItem } from "@/types/repo";

// 분석 제외 파일 리스트
export const ignoredFiles = [
  // 시스템 파일
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",

  // 버전 컨트롤 시스템 파일
  ".git",
  ".gitignore",
  ".gitattributes",
  ".svn",
  ".hg",

  // 빌드 산출물 및 의존성
  "node_modules",
  "vendor",
  "bower_components",
  "build",
  "dist",
  "out",

  // 로그 파일
  "*.log",

  // 임시 파일
  "*.tmp",
  "*.temp",
  "*.swp",
  "*.swo",
  "*~",

  // IDE 및 에디터 설정 파일
  ".vscode",
  ".idea",
  "*.sublime-project",
  "*.sublime-workspace",
  ".project",
  ".settings",

  // 패키지 매니저 락 파일 (취약점 분석에 따라 포함/제외 결정)
  // 'package-lock.json',
  // 'yarn.lock',
  // 'composer.lock',

  // 문서 및 이미지 파일
  "*.md",
  "*.txt",
  "*.pdf",
  "*.doc",
  "*.docx",
  "*.jpg",
  "*.jpeg",
  "*.png",
  "*.gif",
  "*.svg",
  "*.ico",

  // 압축 파일
  "*.zip",
  "*.rar",
  "*.tar.gz",

  // 기타 설정 파일
  ".env.example",
  ".editorconfig",
  ".prettierrc",
  ".eslintrc",

  // 테스트 커버리지 리포트
  "coverage",

  // 특정 언어나 프레임워크 관련 파일
  "__pycache__",
  "*.pyc",
  ".pytest_cache",
  ".mypy_cache",
  ".rspec",
  "Gemfile.lock",
];

function isIgnoredFile(path: string): boolean {
  return ignoredFiles.some((pattern) => {
    if (pattern.startsWith("*")) {
      return path.endsWith(pattern.slice(1));
    }
    return path === pattern || path.includes(`/${pattern}`);
  });
}

export function processRepoTree(repoTree: RepoTree): InspectionList {
  const tree: RepoTreeItem[] = [];
  const ignoredFiles: RepoTreeItem[] = [];
  let ignoredCount = 0;

  repoTree.tree.forEach((item) => {
    if (isIgnoredFile(item.path)) {
      ignoredFiles.push(item);
      ignoredCount++;
    } else {
      tree.push(item);
    }
  });

  return { tree, ignoredFiles, ignoredCount };
}
