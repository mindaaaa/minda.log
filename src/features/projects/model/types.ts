export interface ProjectMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface ProjectCodeSnippet {
  filename: string;
  /** Shiki language id: typescript, javascript, kotlin, tsx, … */
  language: string;
  code: string;
}

export interface ProjectDeepDive {
  title: string;
  content: string;
  /** 딥다이브 본문 아래 코드 예시 */
  codeSnippet?: ProjectCodeSnippet;
}

export interface ProjectNarrativeBlock {
  body: string;
  /** 스캔용 한 줄 결론 (F-패턴 · doc 레이아웃에서 볼드로 먼저 노출) */
  tldr?: string;
  /** 서술을 대체·보강하는 불릿 (있으면 우선 표시) */
  bulletPoints?: string[];
  /** 본문 옆 주석(어노테이션) */
  asideNote?: string;
  /** 본문 직후 VS Code 스타일 코드 블록 */
  codeSnippet?: ProjectCodeSnippet;
  deepDive?: ProjectDeepDive;
}

export interface ProjectNarrative {
  problem: ProjectNarrativeBlock;
  approach: ProjectNarrativeBlock;
  solution: ProjectNarrativeBlock;
  outcome: ProjectNarrativeBlock;
}

export interface ProjectWikiCard {
  teaser: string;
  url: string;
  linkLabel: string;
}

/** 한 프로젝트 안에서 나눠 설명하는 ‘해결한 과제’ 단위 (우측 목차에 제목 노출) */
export interface ProjectChallenge {
  /** 앵커 ID용 슬러그 (영문·숫자·하이픈 권장) */
  id: string;
  /** 카드 상단 제목 */
  title: string;
  /** 목차용 짧은 라벨 (없으면 title) */
  tocLabel?: string;
  problem: ProjectNarrativeBlock;
  approach?: ProjectNarrativeBlock;
  solution: ProjectNarrativeBlock;
  outcome?: ProjectNarrativeBlock;
}

/** 모든 챌린지 이후 한 번에 정리하는 회고·성과 (선택) */
export interface ProjectClosing {
  title?: string;
  body: string;
  tldr?: string;
  bulletPoints?: string[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  /** 개요 카드 메타 (예: 2026.01 – 현재) */
  period?: string;
  /** 개요 카드 메타 (예: Co-founder & Frontend Lead) */
  role?: string;
  tags: string[];
  gradient: string;
  github: string;
  live: string;
  pr?: string;
  docs?: string;
  resources?: { label: string; url: string }[];
  /** 상단 카드용 핵심 수치 */
  metrics?: ProjectMetric[];
  /** 문제–고민–해결–결과 본문 (단일 스토리; `challenges`가 있으면 무시) */
  narrative?: ProjectNarrative;
  /** 여러 과제를 수직 나열할 때 (우측 TOC에 과제별 점프) */
  challenges?: ProjectChallenge[];
  /** 챌린지·위키 이후 최종 정리 */
  closing?: ProjectClosing;
  /** 본문 중간 근거/문서 링크 카드 */
  wikiCard?: ProjectWikiCard;
}
