import React from "react";
import { motion } from "framer-motion";
import { DetailFurtherReading, FurtherReadingItem } from "@/components/detail/DetailFurtherReading";
import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import {
  Lead, H2, H3, BulletList, SectionDivider, Callout, Inline,
  DetailTable, CodeBlock,
} from "@/components/detail/DetailPrimitives";
import { OptionCard, OptionCardGrid, AchievementCard, AchievementGrid, LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
import { Github, Figma, BookOpen } from "lucide-react";

// ─── Further Reading data ────────────────────────────────────────────────────

const FURTHER_READING: FurtherReadingItem[] = [
  {
    type: "ADR",
    title: "손은 하나인데, 화면은 왜 이렇게 넓을까",
    description: "모바일 UX 한 손 조작 최적화 사례",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/%EC%86%90%EC%9D%80-%ED%95%98%EB%82%98%EC%9D%B8%EB%8D%B0,-%ED%99%94%EB%A9%B4%EC%9D%80-%EC%99%9C-%EC%9D%B4%EB%A0%87%EA%B2%8C-%EB%84%93%EC%9D%84%EA%B9%8C",
  },
  {
    type: "ADR",
    title: "지도 서비스는 왜 상태 설계부터 달라야 할까",
    description: "지도 도메인 특화 상태 관리 전략",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/%EC%A7%80%EB%8F%84-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%8A%94-%EC%99%9C-%EC%83%81%ED%83%9C-%EC%84%A4%EA%B3%84%EB%B6%80%ED%84%B0-%EB%8B%AC%EB%9D%BC%EC%95%BC-%ED%95%A0%EA%B9%8C",
  },
  {
    type: "ADR",
    title: "무거운 SDK의 역설",
    description: "SDK 로딩 최적화와 초기 렌더링 전략",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/%EB%AC%B4%EA%B1%B0%EC%9A%B4-SDK%EC%9D%98-%EC%97%AD%EC%84%A4",
  },
  {
    type: "ADR",
    title: "지도는 왜 '구역' 단위로 움직여야 하는가?",
    description: "격자 캐시 정밀도 검토 — 쿼드트리를 택하지 않은 이유",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/%EC%A7%80%EB%8F%84%EB%8A%94-%EC%99%9C-'%EA%B5%AC%EC%97%AD'-%EB%8B%A8%EC%9C%84%EB%A1%9C-%EC%9B%80%EC%A7%81%EC%97%AC%EC%95%BC-%ED%95%98%EB%8A%94%EA%B0%80%3F",
  },
  {
    type: "ADR",
    title: "불완전한 코드를 구원하는 30초의 안전장치",
    description: "에러 바운더리와 안전장치 설계",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/%EB%B6%88%EC%99%84%EC%A0%84%ED%95%9C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EA%B5%AC%EC%9B%90%ED%95%98%EB%8A%94-30%EC%B4%88%EC%9D%98-%EC%95%88%EC%A0%84%EC%9E%A5%EC%B9%98",
  },
  {
    type: "Wiki",
    title: "Lighthouse 기반 성능 분석 및 최적화",
    description: "Core Web Vitals 개선 과정",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/Lighthouse-%EA%B8%B0%EB%B0%98-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94",
  },
  {
    type: "Wiki",
    title: "Sentry 기반 프론트엔드 오류 모니터링",
    description: "프로덕션 에러 추적 및 알림 체계",
    href: "https://github.com/boostcampwm2025/web06-locus/wiki/Sentry-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EA%B0%80%EC%9D%B4%EB%93%9C",
  },
];

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: "locus-context",   label: "상황 및 문제" },
  { id: "locus-ideation",  label: "고민한 방안" },
  { id: "locus-solution",  label: "해결 및 구현" },
  { id: "locus-result",    label: "결과" },
] as const;

// ─── Architecture Diagrams ────────────────────────────────────────────────────

const DIAGRAM_BG = "rgba(155, 142, 196, 0.04)";
const DIAGRAM_BORDER = "rgba(155, 142, 196, 0.18)";
const DIAGRAM_LABEL_COLOR = "#7B6FA6";

function BoundsCacheDiagram() {
  return (
    <div style={{ borderRadius: "12px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: DIAGRAM_LABEL_COLOR, marginBottom: "18px" }}>
        아키텍처 — 격자 캐시 흐름
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "7px 14px", fontSize: "0.78rem", fontWeight: 600, color: "#1a1a2e" }}>
          지도 이동 이벤트
        </div>
        <Arrow />
        <div style={{ background: "rgba(155,142,196,0.1)", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "8px", padding: "7px 14px", fontSize: "0.78rem", fontWeight: 600, color: DIAGRAM_LABEL_COLOR }}>
          roundBoundsToGrid()
        </div>
        <div style={{ fontSize: "0.72rem", color: "rgba(0,0,0,0.35)", marginLeft: "4px" }}>
          GRID_SIZE = 0.01° (≈ 1km)
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginBottom: "6px" }}>
            queryKey (격자 반올림)
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "10px 14px" }}>
            <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "#1a1a2e", lineHeight: 1.7 }}>
              ["records", "bounds",<br />
              &nbsp;&#123; neLat: 37.55,<br />
              &nbsp;&nbsp; neLng: 127.02,<br />
              &nbsp;&nbsp; swLat: 37.52,<br />
              &nbsp;&nbsp; swLng: 126.98 &#125;]
            </code>
          </div>
          <div style={{ marginTop: "6px", fontSize: "0.7rem", color: DIAGRAM_LABEL_COLOR, fontWeight: 500 }}>
            ✓ 미세 패닝 시 동일 키 → 캐시 HIT
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginBottom: "6px" }}>
            API payload (원본 bounds)
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "10px 14px" }}>
            <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "#1a1a2e", lineHeight: 1.7 }}>
              getRecordsByBounds(&#123;<br />
              &nbsp;neLat: 37.5432...,<br />
              &nbsp;neLng: 127.0129...,<br />
              &nbsp;swLat: 37.5218...,<br />
              &nbsp;swLng: 126.9883...<br />
              &#125;)
            </code>
          </div>
          <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "rgba(0,0,0,0.35)", fontWeight: 500 }}>
            서버 정밀도 그대로 유지
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${DIAGRAM_BORDER}`, paddingTop: "14px" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginBottom: "8px" }}>
          줌 레벨별 Prefetch 확장 배수
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { label: "zoom ≥ 12", factor: "3×", bg: "rgba(155,142,196,0.15)", border: "rgba(155,142,196,0.3)" },
            { label: "zoom ≥ 8",  factor: "2×", bg: "rgba(155,142,196,0.08)", border: "rgba(155,142,196,0.2)" },
            { label: "zoom < 8",  factor: "1.5×", bg: "rgba(155,142,196,0.04)", border: "rgba(155,142,196,0.12)" },
          ].map(({ label, factor, bg, border }) => (
            <div key={label} style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: DIAGRAM_LABEL_COLOR, letterSpacing: "-0.03em" }}>{factor}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(0,0,0,0.4)", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MemoryGovernanceDiagram() {
  return (
    <div style={{ borderRadius: "12px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: DIAGRAM_LABEL_COLOR, marginBottom: "18px" }}>
        아키텍처 — 메모리 거버넌스 흐름
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <PipeStep color="#9B8EC4" label="API 응답 (확장 bounds 내 레코드)" />
        <PipeArrow />
        <div style={{ background: "#fff", border: `1px solid ${DIAGRAM_BORDER}`, borderRadius: "10px", padding: "12px 16px", margin: "0 16px" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
            allFetchedRecords <span style={{ fontFamily: "monospace", fontWeight: 400, color: "rgba(0,0,0,0.4)", fontSize: "0.74rem" }}>Map&lt;id, &#123;record, timestamp&#125;&gt;</span>
          </p>
          <p style={{ fontSize: "0.76rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>누적 저장 — 확장 fetch 결과를 모두 보유</p>
        </div>
        <PipeArrow />
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px", padding: "10px 14px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#dc2626", marginBottom: "4px" }}>zoom &lt; 7</p>
            <p style={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.5)", margin: 0, lineHeight: 1.5 }}>광역 뷰 — <strong className="text-foreground">전체 flush</strong><br /><span style={{ fontSize: "0.68rem" }}>새 Map() 반환</span></p>
          </div>
          <div style={{ flex: 1, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "10px", padding: "10px 14px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d97706", marginBottom: "4px" }}>size &gt; 1,000</p>
            <p style={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.5)", margin: 0, lineHeight: 1.5 }}>상한 초과 — <strong className="text-foreground">오래된 항목 제거</strong><br /><span style={{ fontSize: "0.68rem" }}>timestamp 정렬 후 slice</span></p>
          </div>
        </div>
        <PipeArrow />
        <div style={{ background: "rgba(155,142,196,0.1)", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "10px", padding: "12px 16px", margin: "0 16px" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: DIAGRAM_LABEL_COLOR, marginBottom: "4px" }}>
            visibleApiRecords <span style={{ fontFamily: "monospace", fontWeight: 400, color: "rgba(0,0,0,0.4)", fontSize: "0.74rem" }}>useMemo</span>
          </p>
          <p style={{ fontSize: "0.76rem", color: "rgba(0,0,0,0.5)", margin: 0 }}>currentViewBounds 내 좌표만 파생 — 렌더 대상만 줄어듦</p>
        </div>
        <PipeArrow />
        <PipeStep color="#10b981" label="Markers 렌더 (DOM / 오버레이 부담 최소화)" />
      </div>
    </div>
  );
}

function SDKLoadingDiagram() {
  return (
    <div style={{ borderRadius: "12px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: DIAGRAM_LABEL_COLOR, marginBottom: "18px" }}>
        아키텍처 — SDK 로딩 시퀀스
      </p>
      <div className="grid grid-cols-1 min-[560px]:grid-cols-2" style={{ gap: "12px" }}>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginBottom: "8px" }}>
            naverMapLoader.ts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <SeqStep label="loadNaverMapScript() 호출" />
            <SeqFork
              left={{ label: "isLoaded?", yes: "return true (동기)", color: "#10b981" }}
              right={{ label: "promise 존재?", yes: "return 기존 promise", color: "#f59e0b" }}
            />
            <SeqConnector />
            <SeqStep label="<script> 태그 동적 삽입" highlight />
            <SeqConnector />
            <SeqStep label="onload → loadingPromise = null" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)", marginBottom: "8px" }}>
            useMapInstance.ts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <SeqStep label="waitForContainerSize() 호출" />
            <SeqConnector />
            <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "8px", padding: "8px 12px", fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.55 }}>
              <strong style={{ color: "#d97706" }}>offsetWidth/Height = 0?</strong><br />
              requestAnimationFrame(check)<br />
              → 다음 프레임 재시도
            </div>
            <SeqConnector />
            <SeqStep label="offsetWidth > 0 → resolve(true)" highlight />
            <SeqConnector />
            <SeqStep label="new naver.maps.Map(container)" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small diagram helpers ─────────────────────────────────────────────────────

function Arrow() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M0 8h16M10 2l6 6-6 6" stroke="rgba(155,142,196,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PipeStep({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ margin: "0 16px", background: "#fff", border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0", padding: "9px 14px" }}>
      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a1a2e" }}>{label}</span>
    </div>
  );
}

function PipeArrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M8 0v16M2 10l6 8 6-8" stroke="rgba(155,142,196,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SeqStep({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? "rgba(155,142,196,0.1)" : "#fff",
      border: highlight ? "1px solid rgba(155,142,196,0.25)" : "1px solid rgba(0,0,0,0.08)",
      borderRadius: "7px", padding: "7px 10px",
      fontSize: "0.73rem", color: "#1a1a2e", lineHeight: 1.45,
      fontWeight: highlight ? 600 : 400,
    }}>
      {label}
    </div>
  );
}

function SeqConnector() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
      <div style={{ width: "1px", height: "12px", background: "rgba(155,142,196,0.3)" }} />
    </div>
  );
}

function SeqFork({ left, right }: {
  left: { label: string; yes: string; color: string };
  right: { label: string; yes: string; color: string };
}) {
  return (
    <div style={{ display: "flex", gap: "4px", margin: "2px 0" }}>
      {[left, right].map((item) => (
        <div key={item.label} style={{ flex: 1, background: `${item.color}0a`, border: `1px solid ${item.color}25`, borderRadius: "7px", padding: "6px 8px", fontSize: "0.68rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
          <strong style={{ color: item.color }}>{item.label}</strong><br />{item.yes}
        </div>
      ))}
    </div>
  );
}

// ─── Lighthouse bar ───────────────────────────────────────────────────────────

function LighthouseBar({ before, after, label }: { before: number; after: number; label: string }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a2e" }}>{label}</span>
        <span style={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.4)" }}>
          <span style={{ color: "#ef4444", fontWeight: 600 }}>{before}</span>
          <span style={{ margin: "0 6px" }}>→</span>
          <span style={{ color: "#10b981", fontWeight: 700 }}>{after}</span>
        </span>
      </div>
      <div style={{ position: "relative", height: "8px", borderRadius: "4px", background: "rgba(0,0,0,0.06)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${before}%`, borderRadius: "4px", background: "rgba(239,68,68,0.25)" }} />
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: "4px", background: "linear-gradient(90deg, #C8B8F8, #9B8EC4)" }}
          initial={{ width: `${before}%` }}
          whileInView={{ width: `${after}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ─── Hero content ─────────────────────────────────────────────────────────────

const HERO_TITLE_SIZE_FULL = 72;
const HERO_TITLE_SIZE_INLINE = 48;
const HERO_SUB_SIZE = 19;

function HeroContent() {
  const heroLayout = useHeroLayout();
  const isInline = heroLayout === "inline-landscape" || heroLayout === "inline-portrait";
  const titleSize = isInline ? HERO_TITLE_SIZE_INLINE : HERO_TITLE_SIZE_FULL;

  return (
    <>
      <h1
        style={{
          fontSize: titleSize,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.02,
          color: "var(--doc-ink)",
          margin: "0 0 18px",
        }}
      >
        Locus
      </h1>
      <p style={{ fontSize: HERO_SUB_SIZE, color: "var(--doc-ink-2)", fontWeight: 400, lineHeight: 1.55, margin: "0 0 32px", maxWidth: 640 }}>
        공간 기반 기록 서비스 — 지도 위에서 네트워크, 메모리, 렌더링이 동시에 충돌하는 문제를 풀다.
      </p>
      <DocMeta items={[
        { key: "역할", value: "Frontend Lead" },
        { key: "기간", value: "2025.08 — 2026.02" },
        { key: "스택", value: (
          <StackRow>
            {["React", "TypeScript", "TanStack Query", "Naver Maps SDK", "Sentry", "모노레포"].map((t) => (
              <StackChip key={t} label={t} />
            ))}
          </StackRow>
        )},
      ]} />
      <ActionRow>
        <DetailActionButton variant="primary" icon={<Github size={15} />} label="GitHub" href="https://github.com/boostcampwm2025/web06-locus" />
        <DetailActionButton variant="ghost" icon={<Figma size={15} />} label="Figma" href="https://figma.com/design/0PFs4g91g1UMxzWqOROtZt/Locus-—-Full-App-UI?t=0ANjWg245DpmzY6A-0" />
        <DetailActionButton variant="ghost" icon={<BookOpen size={15} />} label="Wiki" href="https://github.com/boostcampwm2025/web06-locus/wiki" />
      </ActionRow>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function LocusDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName="Locus"
      toc={TOC}
      tocClassName="locus-toc"
      heroContent={<HeroContent />}
      heroVideo={{
        layout: "tabs",
        projectName: "Locus",
        tabs: [
          { key: "web", label: "Web", src: "", orientation: "landscape", caption: "데스크톱 브라우저에서 지도 탐색·기록 추가" },
          { key: "mobile", label: "Mobile", src: "", orientation: "portrait", caption: "PWA 설치 후 현장에서 빠른 기록" },
        ],
      }}
      onBack={onBack}
      accent="#0ea5e9"
    >

      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="locus-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>이벤트 × 렌더링 × 상태가 겹치는 지도 도메인의 복합 문제</H2>

        <Lead>
          Locus는 사용자가 지도 위에서 공간 기반 기록을 남기고 탐색하는 서비스다. 일반 CRUD 앱과 달리
          지도 이동·줌 변경이 실시간으로 네트워크 요청, 상태 갱신, 렌더링을 동시에 건드리는 구조를 가진다.
          이 교차점에서 네트워크 비용, 메모리 과부하, 초기 로딩 품질, 모바일 UX까지 여러 문제가 동시에 발생했다.
        </Lead>

        <BulletList items={[
          <><strong className="text-foreground">네트워크 · 비용:</strong> 지도를 조금만 움직여도 bounds가 변해 API가 반복 호출되고, 인프라 트래픽과 깜빡임이 동시에 증가한다.</>,
          <><strong className="text-foreground">캐시 키 민감도:</strong> 미세 패닝마다 queryKey가 달라지면 TanStack Query 캐시가 매번 미스 나 사실상 캐시가 없는 것과 동일해진다.</>,
          <><strong className="text-foreground">메모리 · 렌더링:</strong> 확장 bounds로 미리 가져온 전체 기록을 모두 마커로 유지하면 DOM/오버레이 부담으로 저사양 기기에서 프리징이 난다.</>,
          <><strong className="text-foreground">초기 로딩 · 메인 스레드:</strong> Naver Maps SDK는 스크립트·초기화가 무겁고, 컨테이너 크기 0인 상태에서 붙이면 실패하거나 화이트아웃에 가깝게 보인다.</>,
          <><strong className="text-foreground">모바일 UX:</strong> 한 손 조작·하단 시트 패턴이 없으면 지도 + 상세 + 생성 흐름이 뷰포트 안에서 경쟁한다.</>,
          <><strong className="text-foreground">관측성 · 노이즈:</strong> bounds 경고(초기 레이아웃 등)가 잦으면 Sentry만 두면 비용·노이즈가 폭증한다.</>,
        ]} />

        <Callout label="핵심 과제">
          <strong>네트워크 비용, 메모리 안정성, 초기 로딩 품질, 모바일 UX를 단일 설계로 동시에 해결해야 했다.</strong>
          <br />
          각 문제는 독립적이지 않고 하나의 지도 인터랙션 파이프라인 위에서 연쇄적으로 발생한다.
        </Callout>
      </DetailSection>

      {/* ── 02. 고민한 방안 ── */}
      <SectionGap>
        <DetailSection id="locus-ideation">
          <SectionDivider number="02" label="고민한 방안" />
          <H2>5개 도메인 각각의 트레이드오프를 비교 검토</H2>

          <Lead>
            네트워크·캐시, 메모리, SDK 로딩, 모바일 UX, 관측성 다섯 축으로 나누어 각각 방안을 비교했다.
            모든 선택은 구현 단순성과 운영 안정성 사이의 균형을 기준으로 결정했다.
          </Lead>

          <H3>① 네트워크 · 캐시 전략</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="pan/zoom마다 즉시 fetch" pros="구현 단순" cons="요청 폭주, 비용·깜빡임" />
            <OptionCard letter="B" title="확장 bounds + 줌별 배수(1.5~3배)" pros="드래그 한 번을 한 묶음으로 커버" cons="배수·경계 재요청 조건 튜닝 필요" chosen />
            <OptionCard letter="C" title="queryKey = 원시 bounds" pros="지리적으로 정밀" cons="미세 이동마다 캐시 미스" />
            <OptionCard letter="D" title="queryKey = 격자 반올림, 요청 payload = 원본" pros="서버 정밀도 유지 + 클라 캐시 안정" cons="팀원에게 키와 요청이 다르다고 설명 필요" chosen />
          </OptionCardGrid>
          <Callout>
            <strong>선택: B + D</strong> — 확장 bounds로 prefetch 범위를 넓히고, queryKey는 격자 반올림으로 안정화한다. API payload에는 원본 bounds를 그대로 전달해 서버 정밀도를 유지한다.
          </Callout>

          <H3>② 메모리 · 표시 데이터 분리</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="fetch된 전부를 항상 렌더" pros="구현 단순" cons="마커 수 폭주 시 메모리·프레임 붕괴" />
            <OptionCard letter="B" title="Map에 타임스탬프와 함께 누적 + 상한(1,000) + 오래된 것부터 제거" pros="장시간 탐색에서도 상한이 있음" cons="LRU 정책·줌 아웃 기준 필요" chosen />
            <OptionCard letter="C" title="줌 임계(7 미만)에서 캐시 전체 flush" pros="광역 뷰에서 불필요한 데이터 일괄 정리" cons="탐색 깊이에 따라 다시 fetch 발생" chosen />
            <OptionCard letter="D" title="화면 bounds 안의 것만 useMemo로 derive" pros="렌더 대상만 줄어듦" cons="전역 맵과 파생 배열 동기화 유지 필요" chosen />
          </OptionCardGrid>
          <Callout>
            <strong>선택: B + C + D</strong> — 누적 Map으로 장시간 탐색을 커버하고, 상한·플러시로 메모리 안정성을 확보한 뒤, 화면 내 데이터만 useMemo로 파생해 렌더 부담을 분리한다.
          </Callout>

          <H3>③ SDK 로딩 · 프레임 초기화</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="index.html에 스크립트 동기 태그" pros="빠른 PoC" cons="파싱·실행이 메인 스레드를 오래 점유" />
            <OptionCard letter="B" title="동적 삽입 + loadingPromise 싱글톤" pros="중복 주입·레이스 방지" cons="로드 실패·타임아웃 처리 필요" chosen />
            <OptionCard letter="C" title="컨테이너 크기 0이면 rAF으로 재시도" pros="레이아웃 안 잡힌 상태에서 인스턴스 생성 방지" cons="초기화 지연·조건 분기 증가" chosen />
            <OptionCard letter="D" title="최초 페인트 후 rAF + 짧은 setTimeout으로 오버레이 제거" pros="React 첫 프레임과 브라우저 페인트 정렬" cons="타이밍 매직넘버 관리" />
          </OptionCardGrid>
          <Callout>
            <strong>선택: B + C</strong> — 스크립트 삽입은 싱글톤 promise로 한 번만 진행하고, 컨테이너 크기 확인은 rAF 폴링으로 처리해 레이아웃이 준비된 뒤 맵 인스턴스를 생성한다.
          </Callout>

          <H3>④ 모바일 UX</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="모든 상세를 별도 라우트 풀페이지" pros="구현 익숙" cons="지도 컨텍스트와 분리되기 쉬움" />
            <OptionCard letter="B" title="BottomSheet + 지도 위 오버레이" pros="한 손·지도 고정 UX" cons="시트·맵 이벤트 전파 제어 필요" chosen />
          </OptionCardGrid>

          <H3>⑤ 관측성 · Sentry 노이즈</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="모든 warn을 Sentry로" pros="놓칠 것 없음" cons="빈번한 경고로 쿼터·노이즈 폭발" />
            <OptionCard letter="B" title="경고마다 sendToSentry 플래그로 제어" pros="운영 단계별 노이즈 차단" cons="정책 문서화 필요" chosen />
          </OptionCardGrid>
        </DetailSection>
      </SectionGap>

      {/* ── 03. 해결 및 구현 ── */}
      <SectionGap>
        <DetailSection id="locus-solution">
          <SectionDivider number="03" label="해결 및 구현" />
          <H2>5개 결정을 코드로 고정한 구현</H2>

          <H3>3-1. 격자 캐시 + TanStack Query</H3>
          <Lead>
            <Inline>GRID_SIZE = 0.01°</Inline>(≈ 1km) 격자로 bounds를 반올림해 <strong>queryKey를 안정화</strong>하고,
            API에는 <strong>원본 bounds</strong>를 넘긴다. 줌에 따라 <Inline>getExpansionFactor</Inline>로
            1.5~3배 확장해 prefetch 범위를 조절한다. 격자 계산과 캐시 lookup 모두 O(1)이므로
            동일 격자 패닝에서는 네트워크를 완전히 생략한다.
          </Lead>

          <BoundsCacheDiagram />

          <CodeBlock filename="features/home/utils/boundsUtils.ts" code={`const GRID_SIZE = 0.01;
function gridIndexToCoord(gridIndex: number): number {
  return gridIndex * GRID_SIZE;
}

export function roundBoundsToGrid(bounds: Bounds): Bounds {
  return {
    neLat: gridIndexToCoord(Math.ceil(bounds.neLat / GRID_SIZE)),
    neLng: gridIndexToCoord(Math.ceil(bounds.neLng / GRID_SIZE)),
    swLat: gridIndexToCoord(Math.floor(bounds.swLat / GRID_SIZE)),
    swLng: gridIndexToCoord(Math.floor(bounds.swLng / GRID_SIZE)),
  };
}

export function getExpansionFactor(zoom: number): number {
  if (zoom >= 12) return 3;
  if (zoom >= 8) return 2;
  return 1.5;
}`} />

          <CodeBlock filename="features/record/hooks/useGetRecordsByBounds.ts" code={`const gridBounds = request ? roundBoundsToGrid({ ...request }) : null;

return useQuery({
  queryKey: ['records', 'bounds', gridBounds], // 격자 반올림 → 안정적인 키
  queryFn: () => getRecordsByBounds(request!), // 원본 bounds → 서버 정밀도 유지
  staleTime: 300_000,                           // 5분간 신선 — 같은 격자 재요청 없음
});`} />

          <Callout>
            <strong>핵심 인사이트:</strong> queryKey와 queryFn의 인자를 의도적으로 분리했다.
            키는 캐시 안정성을 위해 격자로 반올림하고, 실제 요청은 원본 정밀도를 유지한다.
            팀원에게 "키와 요청이 다르다"는 점을 명확히 문서화하는 것이 이 방식의 전제 조건이다.
          </Callout>

          <H3>3-2. 메모리 거버넌스 + 화면 내 레코드만 렌더</H3>
          <Lead>
            서버/확장 영역에서 가져온 데이터는 <Inline>Map&lt;id, &#123;record, timestamp&#125;&gt;</Inline>로 누적한다.
            건수가 1,000을 넘으면 타임스탬프 오름차순으로 잘라내고, 줌 7 미만이면 광역 뷰로 보고 전체를 비운다.
            화면 bounds에 들어오는 것만 <Inline>visibleApiRecords</Inline>로 파생해 마커로 렌더한다.
          </Lead>

          <MemoryGovernanceDiagram />

          <CodeBlock filename="features/home/ui/MapViewport.tsx" code={`// 메모리 거버넌스 — 줌 변경 시 trim / flush
useEffect(() => {
  const MAX_RECORDS = 1000;
  const LOW_ZOOM_THRESHOLD = 7;

  setAllFetchedRecords((prev) => {
    if (currentZoom < LOW_ZOOM_THRESHOLD) return new Map(); // 광역 뷰 → 전체 flush
    if (prev.size > MAX_RECORDS) {
      const sorted = Array.from(prev.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );
      return new Map(sorted.slice(-MAX_RECORDS)); // 오래된 것부터 제거
    }
    return prev;
  });
}, [currentZoom]);

// 화면 내 레코드만 파생 — 렌더 대상을 최소화
const visibleApiRecords = useMemo(() => {
  if (!currentViewBounds || allFetchedRecords.size === 0) return [];
  const visible: ApiRecord[] = [];
  allFetchedRecords.forEach(({ record }) => {
    if (
      isWithinBounds(
        record.location.latitude,
        record.location.longitude,
        currentViewBounds,
      )
    )
      visible.push(record);
  });
  return visible;
}, [currentViewBounds, allFetchedRecords]);`} />

          <Callout>
            <strong>한계(정직하게):</strong> 고정 격자는 줌별 밀도 차이를 완벽히 반영하지 못한다.
            쿼드트리 기반 공간 인덱싱은 후속 검토 안건으로 남겨뒀다.
            정렬 시 O(N log N)이지만 N이 상한(1,000)에 가깝게 묶여 실제 부담은 제한적이다.
          </Callout>

          <H3>3-3. SDK 동적 로딩 · 싱글톤 · 컨테이너 rAF</H3>
          <Lead>
            스크립트 삽입은 <Inline>loadingPromise</Inline> 싱글톤으로 한 번만 진행해 중복 주입과 레이스 컨디션을 막는다.
            맵 인스턴스는 컨테이너 <Inline>offsetWidth/Height</Inline>가 0이면
            <Inline>requestAnimationFrame</Inline> 폴링으로 다음 프레임까지 대기한 뒤 생성한다.
          </Lead>

          <SDKLoadingDiagram />

          <CodeBlock filename="infra/map/naverMapLoader.ts" code={`let loadingPromise: Promise<boolean> | null = null;

export function loadNaverMapScript({
  clientId,
}: NaverMapLoaderOptions): Promise<boolean> {
  if (isNaverMapLoaded()) return Promise.resolve(true);   // 이미 로드됨
  if (loadingPromise) return loadingPromise;               // 진행 중 → 재사용

  const promise = new Promise<boolean>(/* <script> 태그 동적 삽입 */).finally(() => {
    loadingPromise = null; // 완료·실패 후 초기화 — 재시도 허용
  });
  loadingPromise = promise;
  return promise;
}`} />

          <CodeBlock filename="shared/hooks/useMapInstance.ts" code={`// 컨테이너 레이아웃이 잡힐 때까지 rAF로 폴링
const waitForContainerSize = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const check = () => {
      const container = mapContainerRef.current;
      if (!container || mapInstanceRef.current) return resolve(false);
      if (container.offsetWidth > 0 && container.offsetHeight > 0)
        resolve(true);        // 레이아웃 준비 완료
      else requestAnimationFrame(check); // 다음 프레임 재시도
    };
    check();
  });
};`} />

          <H3>3-4. 모바일 상호작용 — BottomSheet</H3>
          <Lead>
            지도 위에 <strong>BottomSheet</strong>를 오버레이해, 지도 탐색과 기록 상세 조회가 같은 화면에서 경쟁하지 않도록 한다.
            <Inline>isBottomSheetOpen</Inline>, 연결선 토글 등을 state로 분리해 이벤트 전파를 제어한다.
          </Lead>
          <DetailTable headers={["state", "역할"]} rows={[
            { cells: ["isBottomSheetOpen", "시트가 열려 있는 동안 지도 터치 이벤트 차단"] },
            { cells: ["selectedRecordId", "마커 선택 → 시트에 해당 기록 상세 표시"] },
            { cells: ["showConnectionLines", "기록 간 연결선 토글 — 렌더 부담 분리"] },
          ]} />

          <H3>3-5. 관측성 · Sentry 노이즈 제어</H3>
          <Lead>
            bounds가 무효에 가까울 때(초기 레이아웃 등)는 경고 로그만 남기고
            <Inline>sendToSentry: false</Inline>로 빈번한 케이스를 Sentry에서 제외한다.
            Joka에서 구축한 레이어 기반 로거 정책(<Inline>expected / business / operational / bug</Inline>)과
            같은 접근법을 Locus에도 적용해 운영 노이즈를 차단한다.
          </Lead>
          <CodeBlock filename="infra/api/services/recordService.ts" code={`// bounds 유효성 검증 — 빈번한 경고는 Sentry에서 제외
function validateBounds(bounds: Bounds): void {
  const isValidBounds =
    bounds.neLat > bounds.swLat &&
    bounds.neLng > bounds.swLng &&
    Math.abs(bounds.neLat - bounds.swLat) > MIN_BOUNDS_DIFF;

  if (!isValidBounds) {
    logger.operational('Invalid bounds detected', {
      bounds,
      sendToSentry: false, // 초기 레이아웃 등 빈번한 케이스 제외
    });
  }
}`} />
        </DetailSection>
      </SectionGap>

      {/* ── 04. 결과 ── */}
      <SectionGap>
        <DetailSection id="locus-result" isLast>
          <SectionDivider number="04" label="결과" />
          <H2>성능 지표 개선과 런타임 안정성 확보</H2>

          <Lead>
            격자 캐시·메모리 거버넌스·SDK 초기화·모바일 UX를 단일 파이프라인으로 정비한 뒤,
            Lighthouse 성능 점수가 55에서 71로 올랐다. 수치는 이 다섯 가지 결정이 복합 작용한 결과로 해석하는 것이 타당하다.
          </Lead>

          <div style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "12px", padding: "20px 24px", marginBottom: "1.75rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#059669", marginBottom: "16px" }}>
              Lighthouse Performance
            </p>
            <LighthouseBar before={55} after={71} label="Performance" />
            <p style={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.4)", marginTop: "8px", lineHeight: 1.6 }}>
              API 호출 빈도·메모리 상한·초기 로딩 체감을 동시에 다룬 뒤 나온 수치.
              단일 최적화가 아닌 5개 결정의 복합 효과다.
            </p>
          </div>

          <H3>정성적 성과</H3>
          <AchievementGrid>
            <AchievementCard title="패닝 구간 캐시 재사용" description="같은 격자 내 이동에서는 네트워크 요청 없이 캐시 HIT — 깜빡임·트래픽 비용 동시 감소." />
            <AchievementCard title="장시간 사용 메모리 안정" description="기록 개수 상한(1,000)과 광역 줌 flush로 장시간 탐색 시에도 런타임 안정성 확보." />
            <AchievementCard title="프리징·화이트아웃 완화" description="SDK·컨테이너·첫 페인트 순서를 정리해 초기화 실패 케이스 제거." />
            <AchievementCard title="모바일 흐름 정리" description="BottomSheet로 지도 탐색과 기록 상세가 같은 화면에서 공존." />
            <AchievementCard title="Sentry 노이즈 제어" description="sendToSentry 플래그로 빈번한 경고를 운영 환경에서 제외." />
          </AchievementGrid>

          <H3>한계 및 후속 과제</H3>
          <LimitationGrid>
            <LimitationCard item="격자 캐시 정밀도" status="고정 0.01°" note="줌별 밀도를 반영하는 쿼드트리 검토" />
            <LimitationCard item="메모리 정책" status="고정 상한 1,000건" note="실제 기기별 메모리 프로파일링 후 동적 조정" />
            <LimitationCard item="Lighthouse 점수" status="55 → 71" note="Code-splitting, 이미지 최적화로 추가 개선 가능" />
            <LimitationCard item="rAF 타임아웃" status="무한 폴링" note="최대 시도 횟수 제한으로 무한 루프 안전 장치 추가" />
          </LimitationGrid>

          <DetailFurtherReading items={FURTHER_READING} />
        </DetailSection>
      </SectionGap>
    </DetailLayout>
  );
}
