import React from "react";
import { motion } from "framer-motion";
import { DetailFurtherReading, FurtherReadingItem } from "@/components/detail/DetailFurtherReading";
import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import {
  Lead, H2, H3, BulletList, SectionDivider, Callout, Inline,
  DetailTable, CodeBlock,
} from "@/components/detail/DetailPrimitives";
import { LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
import { DiscoveryTimeline } from "@/components/detail/DiscoveryTimeline";
import {
  GroupBox,
  DecisionTree, TreeQuestion, TreeOptions, TreeFinal,
  ChosenCard, ChosenGrid,
  ExcludedHeading, ExcludedRow,
  DiscoveryBlock,
  SplitLayout,
} from "@/components/detail/IdeationVisuals";
import { CategoryBlock, CategoryList, CategorySingle } from "@/components/detail/AchievementCategory";
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
        { key: "기간", value: "2025.12 — 2026.02" },
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
          {
            key: "web",
            label: "Web",
            src: "/videos/locus/main-desktop.webm",
            srcFallback: "/videos/locus/main-desktop.mp4",
            orientation: "landscape",
            caption: "데스크톱 브라우저에서 지도 탐색·기록 추가",
          },
          {
            key: "mobile",
            label: "Mobile",
            src: "/videos/locus/main-mobile.webm",
            srcFallback: "/videos/locus/main-mobile.mp4",
            orientation: "portrait",
            caption: "PWA 설치 후 현장에서 빠른 기록",
          },
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
          일반 CRUD는 사용자의 한 번의 행위가 한 번의 사이클(요청 → 응답 → 갱신)로 끝난다.
          지도는 사용자가 손가락을 끄는 동안에도 <Inline>bounds</Inline>가 끊임없이 바뀌어,
          한 인터랙션이 사이클을 연속으로 폭주시킨다 — 그래서 네트워크·메모리·렌더링이 동시에 부담을 받는다.
        </Lead>
        <Lead>
          사이클이 연속이라 한 축만 풀면 다른 축이 무너진다. 캐시만 안정화하면 메모리가 누적되고,
          메모리만 잡으면 캐시 키가 깨지고, SDK만 빠르게 띄우면 컨테이너 타이밍이 깨진다.
          같은 사이클의 다른 시점에 위치한 문제들이라 분리 해결이 불가능하다.
        </Lead>

        <Lead>
          Locus는 사용자가 지도 위에서 공간 기반 기록을 남기고 탐색하는 서비스다. 일반 CRUD 앱과 달리
          지도 이동·줌 변경이 실시간으로 네트워크 요청, 상태 갱신, 렌더링을 동시에 건드리는 구조를 가진다.
          이 교차점에서 네트워크 비용, 메모리 과부하, 초기 로딩 품질, 모바일 UX까지 여러 문제가 동시에 발생했다.
        </Lead>

        <DiscoveryTimeline
          title="발견 순서 — 6개 축은 동시에 보이지 않았다"
          steps={[
            {
              num: "Step 1",
              eyebrow: "외부 신호",
              title: "카페에서 작업하던 팀원의 보고",
              metas: [
                { key: "신호", body: <>“내가 기록한 게 안 보인다.” 에러 로그 없음.</> },
                { key: "계기", body: <>직접 시연을 보니 지도 타일까지 늦게 오고 있었다 → 네트워크 환경 문제로 짐작.</> },
              ],
            },
            {
              num: "Step 2",
              eyebrow: "재현",
              title: "DevTools Slow 3G로 재현",
              metas: [
                { key: "관찰", body: <>지도를 조금만 움직여도 <Inline>bounds</Inline> 기반 API가 끊임없이 호출된다.</> },
                { key: "추적", body: <>TanStack Query devtools에서 같은 지역을 봐도 매번 새 쿼리가 생기는 걸 확인.</> },
              ],
            },
            {
              num: "Step 3",
              eyebrow: "원인 식별",
              title: "queryKey가 미세 bounds 변화에 너무 민감",
              metas: [
                { key: "결론", body: <>캐시 키가 사실상 부재한 상태였다.</> },
                { key: "결정", body: <>격자 반올림으로 키를 안정화 — 이때부터 02의 ① 네트워크·캐시 축이 명확해졌다.</> },
              ],
            },
            {
              num: "Step 4",
              eyebrow: "정직한 한계",
              title: "6개를 ‘한 사이클의 연쇄’로 묶은 순간은 없었다",
              isFinal: true,
              metas: [
                { key: "한계", body: <>인터랙션 폭주 → 렌더링 부담은 API가 항상 성공해 로그조차 안 남았다. 트레이스를 심어도 호출량 자체가 너무 많아 신호를 추리기 어려웠다.</> },
                { key: "이어짐", body: <>이 관측성의 한계가 다음 프로젝트 <strong className="text-foreground">Joka의 4계층 로거</strong>(<Inline>expected / business / operational / bug</Inline>)와 fingerprint 그룹화 설계의 직접 동기가 됐다.</> },
              ],
            },
          ]}
        />

        <p
          className="font-mono"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--doc-ink-4)",
            margin: "28px 0 8px",
          }}
        >
          한눈에 본 6개 축
        </p>
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

          {/* ① 네트워크·캐시 — 결정트리 (두 단계 의사결정 + 최종 결정의 발견 흔적) */}
          <H3>① 네트워크 · 캐시 전략</H3>
          <GroupBox eyebrow="의사결정 흐름">
            <DecisionTree>
              <TreeQuestion eyebrow="질문" text="언제 fetch할 것인가?" />
              <TreeOptions
                options={[
                  { letter: "A", title: "매번 즉시 fetch", sub: "→ 요청 폭주, Slow 3G에서 깜빡임" },
                  { letter: "B", title: "확장 bounds + 줌별 배수", sub: "→ 드래그 한 번을 한 묶음으로 커버", chosen: true },
                ]}
              />
              <TreeQuestion eyebrow="다음 질문" text="queryKey를 어떻게 안정화할 것인가?" />
              <TreeOptions
                options={[
                  { letter: "C", title: "원시 bounds", sub: "→ 미세 이동마다 캐시 미스" },
                  { letter: "D", title: "격자 반올림 (payload는 원본)", sub: "→ 서버 정밀도 + 클라 캐시 안정", chosen: true },
                ]}
              />
              <TreeFinal
                title="B + D 조합"
                discovery="시드 데이터 시연에서는 문제가 안 보였다. 카페에서 작업하던 팀원의 “기록한 게 안 보인다” 보고로 Slow 3G 재현 → bounds API 폭주를 확인한 시점에 격자 캐시 전환을 결정했다."
              />
            </DecisionTree>
          </GroupBox>

          {/* ② 메모리 — chosen 3카드 + 검토 후 제외 + 실제로는 */}
          <H3>② 메모리 · 표시 데이터 분리</H3>
          <GroupBox>
            <ChosenGrid cols={3}>
              <ChosenCard
                letter="B"
                title="상한 1,000 + 오래된 것부터 제거"
                pros="장시간 탐색 상한 보장"
                cons="LRU 정책 필요"
              />
              <ChosenCard
                letter="C"
                title="광역 줌(<7)에서 캐시 flush"
                pros="광역 뷰 일괄 정리"
                cons="탐색 깊이마다 재 fetch"
              />
              <ChosenCard
                letter="D"
                title="화면 내만 useMemo"
                pros="렌더 대상 감소"
                cons="파생 동기화 유지"
              />
            </ChosenGrid>
            <ExcludedHeading />
            <ExcludedRow letter="A" title="fetch된 전부를 항상 렌더" cons="메모리·프레임 붕괴" />
            <DiscoveryBlock>
              처음에는 상한 없이 무한 누적으로 시작했다. 시연 중 사용자가 지도를 오래 탐색할수록 저사양 기기에서 프레임 드롭과 프리징이 발생하는 걸 직접 봤고, 그 시점에 상한과 timestamp 기반 제거 정책(LRU 단순화 버전)을 도입했다. 광역 줌 아웃은 어차피 개별 마커가 의미 없는 뷰라 전체 flush로 단순화했다.
            </DiscoveryBlock>
          </GroupBox>

          {/* ③ SDK 로딩 — chosen 2카드 + 검토 후 제외 (워크북 답 없음) */}
          <H3>③ SDK 로딩 · 프레임 초기화</H3>
          <GroupBox>
            <ChosenGrid cols={2}>
              <ChosenCard
                letter="B"
                title="동적 삽입 + loadingPromise 싱글톤"
                pros="중복 주입·레이스 방지"
                cons="실패·타임아웃 처리 필요"
              />
              <ChosenCard
                letter="C"
                title="컨테이너 0이면 rAF 폴링"
                pros="레이아웃 미준비 인스턴스 방지"
                cons="초기화 지연·분기 증가"
              />
            </ChosenGrid>
            <ExcludedHeading />
            <ExcludedRow letter="A" title="index.html 동기 스크립트 태그" cons="메인 스레드 점유" />
            <ExcludedRow letter="D" title="rAF + setTimeout 오버레이 제거" cons="매직넘버 관리" />
          </GroupBox>

          {/* ④ 모바일 UX — 좌우 분할 (chosen ↔ 제외 + 실제로는) */}
          <H3>④ 모바일 UX</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="B"
                  title="BottomSheet + 지도 오버레이"
                  pros="한 손·지도 고정 UX"
                  cons="시트·맵 이벤트 전파 제어"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="A" title="상세를 별도 라우트 풀페이지" cons="지도 컨텍스트 분리" stacked />
                  <DiscoveryBlock>
                    BottomSheet 구현이 부담스러워 풀페이지로 시작했다. “걸어다니며 한 손으로 낙서하듯 쓰는” 시나리오에 수렴하면서, 두 손이 필요한 풀페이지를 포기하고 BottomSheet로 전환했다.
                  </DiscoveryBlock>
                </>
              }
            />
          </GroupBox>

          {/* ⑤ 관측성 — 좌우 분할 */}
          <H3>⑤ 관측성 · Sentry 노이즈</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="B"
                  title="sendToSentry 플래그로 제어"
                  pros="운영 단계별 노이즈 차단"
                  cons="정책 문서화 필요"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="A" title="모든 warn을 Sentry로" cons="쿼터·노이즈 폭발" stacked />
                </>
              }
            />
          </GroupBox>
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
            이 노이즈 제어 경험은 후속 프로젝트(Joka)에서 4계층 로거 정책
            (<Inline>expected / business / operational / bug</Inline>)으로 구조화·확장됐다.
          </Lead>
          <CodeBlock filename="infra/api/services/recordService.ts" code={`// bounds 유효성 검증 — 빈번한 경고는 Sentry에서 제외
const MIN_BOUNDS_DIFF = 0.0001;

if (validatedRequest.neLat - validatedRequest.swLat < MIN_BOUNDS_DIFF) {
  logger.warn('Invalid bounds: neLat과 swLat이 너무 가까워서 기록 조회 불가', {
    neLat: validatedRequest.neLat,
    swLat: validatedRequest.swLat,
    diff: validatedRequest.neLat - validatedRequest.swLat,
    sendToSentry: false, // 빈번한 경고이므로 Sentry 전송 비활성화
  });
  return { records: [], totalCount: 0 };
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

          <CategoryBlock num="01" name="사용자 체감" sub="시연·관찰에서 확인">
            <CategoryList
              items={[
                {
                  title: "같은 격자 내 패닝에서 마커 깜빡임이 사라졌다",
                  body: <>Locus 커스텀 마커는 광휘 효과가 들어가 일반 마커보다 렌더 부담이 컸는데, 같은 격자 안 이동에서 마커가 다시 그려지지 않으면서 효과가 끊기지 않게 됐다. 저네트워크 환경에서 마커가 사라졌다 다시 나타나는 구간도 함께 사라졌다.</>,
                },
                {
                  title: "장시간 탐색에서 프리징이 멈췄다",
                  body: <>상한 1,000으로 누적이 멈췄고, 광역 줌 아웃은 어차피 개별 마커가 의미 없는 뷰이므로 전체 flush로 정리해 줌 전환 시 끊김이 없어졌다.</>,
                },
                {
                  title: "초기 화이트아웃이 완화됐다",
                  body: <>SDK·컨테이너·첫 페인트 순서를 정리해 초기화 실패 케이스를 제거했다.</>,
                },
              ]}
            />
          </CategoryBlock>

          <CategoryBlock num="02" name="도구 측정" sub="React DevTools · Lighthouse">
            <CategorySingle
              title="React DevTools Profiler에서 Marker 영역이 빨강 → 초록으로 이동"
              body={<>Lighthouse 55→71과 별개로, 컴포넌트별 렌더 비용을 관찰했다. 격자 캐시·메모리 거버넌스 도입 전 Marker 관련 컴포넌트가 빨강으로 두드러졌고, 도입 후 초록 영역으로 이동하는 걸 확인했다.</>}
              limit={{
                label: "한계",
                body: <>정확한 ms 수치를 기록해두지 않았다. 다음 프로젝트에서는 Profiler 기록 export로 보완할 계획.</>,
              }}
            />
          </CategoryBlock>

          <CategoryBlock num="03" name="설계 회고" sub="02 ④ 결정의 후속 검증">
            <CategorySingle
              title="한 손 사용성을 포기할 수 없어 BottomSheet로 전환한 결정은 옳았다"
              body={<>“걸어다니며 한 손으로 낙서하듯 쓰는” 휘발성 메모 시나리오에 수렴하면서, 두 손이 필요한 풀페이지를 포기한 선택. 시연에서 사용자가 한 손으로 지도를 탐색하면서 시트를 열고 닫는 흐름이 끊기지 않는 걸 확인했고, 시트 높이 동적 조절 부담은 받아들일 만했다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="04" name="운영 · 관측성" sub="Joka 4계층 로거의 직접 동기">
            <CategorySingle
              title="sendToSentry 플래그로 신호와 노이즈를 분리했다"
              body={<>빈번한 bounds 경고를 운영 환경에서 제외해 실제 신호와 노이즈를 분리했다. 이 경험이 다음 프로젝트 Joka의 4계층 로거 정책의 직접 동기가 됐다.</>}
            />
          </CategoryBlock>

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
