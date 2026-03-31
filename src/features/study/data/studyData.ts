import { Layout, Zap, Layers, Shield, BrainCircuit, Network } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StudyResource {
  label: string;
  url: string;
  type: "docs" | "repo" | "reference" | "project";
  description: string;
}

export interface StudyItem {
  id: string;
  phase: string;
  title: string;
  period: string;
  tagline: string;
  description: string;
  keywords: string[];
  whatILearned: string;
  howIApplied: string;
  results: string;
  resources: StudyResource[];
  accentGradient: string;
  glow: string;
  icon: LucideIcon;
}

export const studyItems: StudyItem[] = [
  {
    id: "jamsik-study",
    phase: "Study 01",
    title: "잠식스터디",
    period: "2026.03 - Present",
    tagline: "주간 기술 탐색 및 공유 모임",
    description: "매주 새로운 기술 스택이나 도구를 다뤄보며 다양한 기술 도메인으로 시야를 확장하고, 학습 과정을 문서화해 공유하는 루틴을 유지하고 있습니다.",
    keywords: ["기술 탐색", "문서화", "지식 공유", "주간 스터디"],
    whatILearned: "기술을 빠르게 훑고 핵심을 추려 공유하는 과정에서 문제 정의와 설명 구조를 단단하게 만드는 연습을 했습니다.",
    howIApplied: "주간 단위로 탐색 주제를 정하고, 실습·정리·공유를 반복하면서 학습 내용을 팀/커뮤니티에 전달 가능한 형태로 아카이빙했습니다.",
    results: "새로운 기술을 검토하고 적용 가능성을 판단하는 속도가 빨라졌고, 지식 공유를 통해 학습 지속성을 높였습니다.",
    resources: [
      { label: "스터디 아카이브", url: "#", type: "project", description: "주간 기술 탐색 및 공유 기록" },
    ],
    accentGradient: "from-orange-400 to-rose-500",
    glow: "rgba(249, 115, 22, 0.35)",
    icon: Layout,
  },
  {
    id: "boost-study",
    phase: "Study 02",
    title: "BoostStudy",
    period: "2026.02 - Present",
    tagline: "CS 및 기술 면접 스터디",
    description: "8인 규모의 스터디에서 CS 지식 공유와 교차 이력서 리뷰를 진행하고, GitHub Actions 기반 자동 집계와 Discord 알림으로 운영 부담을 줄였습니다.",
    keywords: ["CS", "면접", "GitHub Actions", "Discord", "자동화"],
    whatILearned: "개념을 설명 가능한 언어로 정리하고, 피드백을 통해 답변 구조를 개선하는 과정에서 면접 대응력을 높였습니다.",
    howIApplied: "자동 집계 및 알림 시스템을 연결해 운영 리소스를 줄이고, 스터디원이 학습 자체에 집중할 수 있게 개선했습니다.",
    results: "스터디 운영이 안정화되었고, 반복 업무 자동화로 참여자 경험과 지속성을 동시에 개선했습니다.",
    resources: [
      { label: "자동 집계 및 Discord 알림", url: "#", type: "project", description: "스터디 운영 자동화 시스템" },
      { label: "스터디 자동 집계 가이드", url: "#", type: "docs", description: "운영 규칙 및 사용 가이드" },
    ],
    accentGradient: "from-yellow-400 to-orange-500",
    glow: "rgba(234, 179, 8, 0.35)",
    icon: Zap,
  },
  {
    id: "mindjuk-systems",
    phase: "Experiment 01",
    title: "팀 mindjuk — 반복 작업 시스템화",
    period: "2026.01 - Present",
    tagline: "실험을 팀 표준으로 전환",
    description: "운영 비용과 확장성을 고려한 실운영 기반 앱 구조를 설계하고, 장애 시 원인 파악을 빠르게 만드는 관측/모니터링 체계를 구축하고 있습니다.",
    keywords: ["운영 자동화", "모니터링", "장애 대응", "UI/UX", "워크플로우"],
    whatILearned: "개발 속도뿐 아니라 운영 가능성까지 포함해 시스템을 설계해야 한다는 기준을 명확히 갖게 되었습니다.",
    howIApplied: "원인 파악을 빠르게 만드는 로깅/모니터링 설계와 가이드 없는 UI 구조를 실험하며 운영 효율을 높였습니다.",
    results: "운영성 이슈를 조기에 탐지하고 대응 속도를 높이는 흐름을 만들었고, 팀 내 기준을 문서화해 재현 가능성을 높였습니다.",
    resources: [
      { label: "실험 회고", url: "#", type: "reference", description: "자동화·문서화·검증 기준 정리" },
    ],
    accentGradient: "from-emerald-400 to-teal-600",
    glow: "rgba(16, 185, 129, 0.35)",
    icon: BrainCircuit,
  },
  {
    id: "http-deep-study",
    phase: "Study 03",
    title: "HTTP 완벽 가이드 심화 스터디",
    period: "2025.12 - 2026.02",
    tagline: "HTTP 메커니즘 심화 학습",
    description: "커넥션 관리, 캐싱, 헤더 등 HTTP 핵심 메커니즘을 학습하고 최신 명세(HTTP/2, 3)와 브라우저 동작 원리를 추가로 조사해 공유했습니다.",
    keywords: ["HTTP", "캐싱", "헤더", "브라우저", "스터디 기록"],
    whatILearned: "프로토콜 레벨에서 성능 병목을 바라보는 시각과, 근거 기반으로 클라이언트 최적화를 설명하는 기준을 갖췄습니다.",
    howIApplied: "주간 발표/토론으로 복잡한 개념을 구조화해 설명하고, 학습 내용을 실무 성능 개선 맥락과 연결했습니다.",
    results: "네트워크/브라우저 레이어 이해가 깊어지면서 성능 관련 의사결정의 정확도가 높아졌습니다.",
    resources: [
      { label: "스터디 기록", url: "#", type: "docs", description: "HTTP 심화 스터디 노트" },
    ],
    accentGradient: "from-sky-400 to-indigo-500",
    glow: "rgba(56, 189, 248, 0.35)",
    icon: Network,
  },
  {
    id: "modern-js-study",
    phase: "Study 04",
    title: "모던 자바스크립트 스터디",
    period: "2025.04 - 2025.05",
    tagline: "엔진 동작 원리 및 문법 체계 기초",
    description: "도서 완독과 저자 질의응답 세션을 통해 엔진 동작 원리와 핵심 문법 체계를 학습하며 자바스크립트 기반기를 다졌습니다.",
    keywords: ["JavaScript", "엔진", "문법", "기초 체력"],
    whatILearned: "언어 스펙과 런타임 동작을 함께 이해해야 코드 품질과 디버깅 효율이 올라간다는 점을 체감했습니다.",
    howIApplied: "개념을 단순 암기가 아닌 동작 원리 중심으로 정리하고, 코드 리뷰와 디버깅 상황에 반복 적용했습니다.",
    results: "자바스크립트 동작을 설명하고 예측하는 능력이 향상되어 문제 해결 속도와 안정성이 높아졌습니다.",
    resources: [
      { label: "스터디 메모", url: "#", type: "reference", description: "핵심 개념 요약 및 질의응답 기록" },
    ],
    accentGradient: "from-violet-400 to-fuchsia-500",
    glow: "rgba(167, 139, 250, 0.35)",
    icon: Layers,
  },
];
