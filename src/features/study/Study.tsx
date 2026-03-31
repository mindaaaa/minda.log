import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: string;
  title: string;
  period: string;
  summary: string;
  bulletPoints: string[];
  learned: string;
  connected: string;
}

const activities: ActivityItem[] = [
  {
    id: "modern-js-deep-dive",
    title: "모던 자바스크립트 Deep Dive 스터디",
    period: "2025",
    summary: "언어 동작 원리를 설계 의도 관점으로 구조화",
    bulletPoints: [
      "실행 컨텍스트, 클로저, 비동기 논블로킹 I/O 핵심 원리 학습",
      "파편 지식을 구조화해 디버깅 기준을 명확히 정리",
      "메모리 누수/레이스 컨디션을 사전 인지하는 감각 확보",
    ],
    learned: "언어 문법보다 동작 원리를 먼저 이해해야 품질이 올라간다는 기준을 만들었습니다.",
    connected: "프로젝트에서 상태 흐름과 비동기 경계를 설계할 때 사전 방어 관점으로 적용했습니다.",
  },
  {
    id: "boostcamp-fullstack",
    title: "네이버 부스트캠프 (Full-stack)",
    period: "2025.08 - 2026.02",
    summary: "데이터가 시스템 전체를 흐르는 과정을 실전으로 체득",
    bulletPoints: [
      "프론트엔드-백엔드-인프라를 잇는 풀스택 사이클 경험",
      "6회 프로젝트 수행으로 협업/문서화/일정관리 역량 강화",
      "API 예외 상황을 프론트에서 선제 정의하는 습관 형성",
    ],
    learned: "단일 화면 구현보다 시스템 흐름을 기준으로 문제를 보는 시야를 얻었습니다.",
    connected: "프론트 작업에서도 백엔드 실패 시나리오를 먼저 정의해 회복 가능한 UX를 설계했습니다.",
  },
  {
    id: "http-was-study",
    title: "HTTP 완벽 가이드 & WAS 구현 스터디",
    period: "2025 - 2026",
    summary: "통신을 라이브러리 사용이 아닌 네트워크 비용 관점으로 이해",
    bulletPoints: [
      "HTTP 패킷 구조, 헤더 역할, Keep-Alive 메커니즘 학습",
      "직접 WAS 구현으로 요청/응답 경계를 실습",
      "캐싱 정책 학습을 기반으로 리소스 비용 최적화 관점 확보",
    ],
    learned: "통신은 호출 자체보다 비용과 일관성을 설계하는 문제라는 점을 체감했습니다.",
    connected: "캐시 전략과 요청 단위를 재설계해 사용자 체감 성능 개선에 반영했습니다.",
  },
  {
    id: "team-mindjuk",
    title: "팀 Mindjuk (사이드 프로젝트)",
    period: "2026",
    summary: "운영 안정성을 팀 단위 실험으로 검증",
    bulletPoints: [
      "로깅/에러 핸들링/워크플로우 등 운영성 중심으로 탐구",
      "n8n, Docker 기반 인프라 자동화 시도",
      "AI 기반 데이터 분석 파이프라인 구축 실험",
    ],
    learned: "개발 완료보다 운영 가능성까지 포함한 품질 기준이 필요함을 학습했습니다.",
    connected: "프론트엔드 역할을 넘어서 운영 효율화 관점으로 설계 범위를 확장했습니다.",
  },
  {
    id: "boost-study",
    title: "BoostStudy (CS & 기술 면접 스터디)",
    period: "2026 - Present",
    summary: "개념을 설명 가능한 언어로 정리하는 훈련",
    bulletPoints: [
      "자료구조/알고리즘 등 CS 기초를 순환 학습",
      "동료 관점 비교로 동일 개념에 대한 이해 폭 확장",
      "모호한 개념을 명확한 문장으로 전달하는 연습",
    ],
    learned: "이해한 내용을 설명 가능한 수준으로 구조화해야 실전에서 힘을 발휘함을 배웠습니다.",
    connected: "리뷰/협업 상황에서 기술 의사결정을 더 명확하고 설득력 있게 전달하게 됐습니다.",
  },
  {
    id: "jabsik-study",
    title: "잡식 스터디 (인사이트 공유 그룹)",
    period: "2026 - Present",
    summary: "주간 공유 루틴으로 학습 지속성과 시야 확장",
    bulletPoints: [
      "개발 근황과 기술 트렌드를 주기적으로 공유",
      "코드 공유와 마감 기반으로 학습 루틴 유지",
      "타 분야 사례를 통해 문제 해결 관점 유연화",
    ],
    learned: "지속 가능한 성장에는 학습 자체보다 루틴과 피드백 구조가 중요함을 확인했습니다.",
    connected: "짧은 실험-공유-회고 사이클을 업무에도 적용해 개선 속도를 높였습니다.",
  },
];

export default function Study() {
  const [selectedId, setSelectedId] = useState<string>(activities[0].id);
  const selected = activities.find((item) => item.id === selectedId) ?? activities[0];

  return (
    <section className="mx-auto flex h-full w-full max-w-6xl flex-col pb-8 pt-8">
      <header className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="theme-section-label mb-2 text-sm font-medium uppercase tracking-[0.18em]">활동</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          왼쪽은 타임라인 탐색, 오른쪽은 선택 활동의 핵심 요약입니다. 긴 문장보다 빠르게 읽히는 불렛 중심으로 구성했습니다.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 md:grid-cols-10">
        <aside className="min-h-0 md:col-span-3">
          <div className="h-full rounded-xl border border-slate-200/80 bg-white/70 p-3">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Timeline</p>
            <ol className="relative pl-5">
              <div className="absolute bottom-2 left-2 top-2 w-px bg-slate-300/80" />
              {activities.map((item) => {
                const isSelected = item.id === selected.id;
                return (
                  <li key={item.id} className="relative mb-1.5 last:mb-0">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-sky-50" : "hover:bg-slate-100/70"
                      }`}
                    >
                      <span
                        className={`absolute left-[-14px] top-5 h-2.5 w-2.5 rounded-full border ${
                          isSelected
                            ? "border-sky-500 bg-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.18)]"
                            : "border-slate-400 bg-white"
                        }`}
                      />
                      <p className={`text-sm leading-tight ${isSelected ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                        {item.title}
                      </p>
                      <p className={`mt-1 text-[11px] ${isSelected ? "text-sky-700" : "text-slate-500"}`}>{item.period}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        <main className="min-h-0 md:col-span-7">
          <div className="h-full rounded-xl border border-slate-200/80 bg-white/85 p-6 md:p-7">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Main Panel</p>
            <AnimatePresence mode="wait">
              <motion.article
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="mb-6 border-b border-slate-200 pb-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{selected.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selected.period}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700">{selected.summary}</p>
                </header>

                <section className="mb-6">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">핵심 요약</h4>
                  <ul className="space-y-2">
                    {selected.bulletPoints.map((line) => (
                      <li key={line} className="text-sm leading-relaxed text-slate-800">
                        • {line}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-50/80 p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">배움</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{selected.learned}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/80 p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">연결</h4>
                    <p className="text-sm leading-relaxed text-slate-700">{selected.connected}</p>
                  </div>
                </section>
              </motion.article>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </section>
  );
}
