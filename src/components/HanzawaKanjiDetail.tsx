import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import { Lead, H2, H3, BulletList, SectionDivider, Callout, Inline, DetailTable, CodeBlock } from "@/components/detail/DetailPrimitives";
import { StatCard, StatCardGrid, LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
import { DiscoveryTimeline } from "@/components/detail/DiscoveryTimeline";
import {
  GroupBox,
  ChosenCard, ChosenGrid,
  ExcludedHeading, ExcludedRow,
  DiscoveryBlock,
} from "@/components/detail/IdeationVisuals";
import { CategoryBlock, CategorySingle } from "@/components/detail/AchievementCategory";
import { Github } from "lucide-react";
import { DetailFurtherReading, FurtherReadingItem } from "@/components/detail/DetailFurtherReading";

const ACCENT = "#f59e0b";

// ─── Further Reading data ────────────────────────────────────────────────────

const FURTHER_READING: FurtherReadingItem[] = [];

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: "kanji-context",   label: "상황 및 문제" },
  { id: "kanji-ideation",  label: "고민한 방안" },
  { id: "kanji-solution",  label: "해결 및 구현" },
  { id: "kanji-result",    label: "결과" },
] as const;

// ─── Architecture Diagrams ─────────────────────────────────────────────────────

function CursorPaginationDiagram() {
  return (
    <div style={{ borderRadius: "14px", border: "1px solid rgba(155,142,196,0.18)", background: "rgba(155, 142, 196, 0.04)", padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7B6FA6", marginBottom: "18px" }}>
        아키텍처 — 커서 기반 페이지네이션 (limit+1 패턴)
      </p>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Server side */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>서버 — limit+1 조회</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "8px", padding: "9px 13px" }}>
              <p style={{ fontSize: "0.73rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "3px" }}>요청: limit=10, cursor=42</p>
              <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.5)", margin: 0 }}>실제 DB 조회: <Inline>limit+1 = 11</Inline>건</p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ flex: 1, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: "8px", padding: "8px 11px" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#059669", marginBottom: "3px" }}>11건 반환됨</p>
                <p style={{ fontSize: "0.68rem", color: "rgba(20,18,40,0.5)", margin: 0, lineHeight: 1.5 }}>
                  items = 앞 10건<br />
                  cursor = 11번째 id<br />
                  <span style={{ color: "#059669" }}>hasMore = true</span>
                </p>
              </div>
              <div style={{ flex: 1, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "8px", padding: "8px 11px" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#dc2626", marginBottom: "3px" }}>10건 이하 반환됨</p>
                <p style={{ fontSize: "0.68rem", color: "rgba(20,18,40,0.5)", margin: 0, lineHeight: 1.5 }}>
                  items = 전체<br />
                  cursor = null<br />
                  <span style={{ color: "#dc2626" }}>hasMore = false</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", paddingTop: "40px" }}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M0 8h18M12 2l8 6-8 6" stroke="rgba(155,142,196,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Client side */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>클라이언트 응답 처리</p>
          <div style={{ background: "rgba(155,142,196,0.08)", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "8px", padding: "10px 13px" }}>
            <code style={{ fontFamily: "monospace", fontSize: "0.73rem", color: "#1a1a2e", lineHeight: 1.7 }}>
              &#123;<br />
              &nbsp;items: KanjiItem[10],<br />
              &nbsp;cursor: <span style={{ color: "#059669" }}>"id_of_11th"</span>,<br />
              &nbsp;totalCount: 2136<br />
              &#125;
            </code>
          </div>
          <div style={{ marginTop: "6px", fontSize: "0.69rem", color: "#7B6FA6", fontWeight: 500, lineHeight: 1.55 }}>
            cursor를 다음 요청에 전달 →<br />
            offset 페이지 일관성 보장
          </div>
        </div>
      </div>

      <div style={{ marginTop: "14px", borderTop: "1px solid rgba(155,142,196,0.15)", paddingTop: "12px" }}>
        <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.5)", margin: 0, lineHeight: 1.6 }}>
          <strong className="text-foreground">offset과의 차이:</strong> offset 기반은 중간 삽입·삭제 시 페이지 경계가 흔들려 같은 항목이 두 번 노출되거나 누락될 수 있다.
          커서는 마지막으로 본 항목의 id를 기준으로 조회하므로 데이터 변경에도 순서가 안정적이다.
        </p>
      </div>
    </div>
  );
}

function PrefetchTimingDiagram() {
  const TOTAL_ITEMS = 10;
  const THRESHOLD = 5;
  return (
    <div style={{ borderRadius: "14px", border: "1px solid rgba(155,142,196,0.18)", background: "rgba(155, 142, 196, 0.04)", padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7B6FA6", marginBottom: "18px" }}>
        아키텍처 — Prefetch 트리거 타이밍
      </p>

      {/* Quiz progress bar */}
      <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.45)", marginBottom: "8px" }}>무한 모드 문항 진행 예시 (총 10문항 로드 중)</p>
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
          {Array.from({ length: TOTAL_ITEMS }).map((_, i) => {
            const isAnswered = i < 6;
            const isTrigger = i === TOTAL_ITEMS - THRESHOLD;
            return (
              <div key={i} style={{ flex: 1, height: "32px", borderRadius: "6px", background: isAnswered ? "rgba(155,142,196,0.25)" : "rgba(155,142,196,0.06)", border: `1px solid ${isTrigger ? "rgba(239,68,68,0.6)" : "rgba(155,142,196,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: isAnswered ? "#b45309" : "rgba(20,18,40,0.25)", position: "relative" }}>
                {i + 1}
                {isTrigger && (
                  <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", fontWeight: 700, color: "#dc2626", whiteSpace: "nowrap" }}>
                    ↓ prefetch 시작
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "rgba(20,18,40,0.35)" }}>
          <span>풀 로드됨</span>
          <span style={{ color: "#dc2626", fontWeight: 600 }}>잔여 5개 지점 → fetchQuiz()</span>
          <span>소진</span>
        </div>
      </div>

      {/* Flow */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <div style={{ background: "#fff", border: "1px solid rgba(20,18,40,0.1)", borderRadius: "10px", padding: "10px 14px", margin: "0 16px" }}>
          <p style={{ fontSize: "0.76rem", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>
            <Inline>quizIndex &gt;= quizList.length - 5</Inline> 조건 충족
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "3px 0" }}>
          <div style={{ width: "1px", height: "14px", background: "rgba(155,142,196,0.4)" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", margin: "0 0" }}>
          <div style={{ flex: 1, background: "rgba(155,142,196,0.08)", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "10px", padding: "9px 13px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7B6FA6", marginBottom: "3px" }}>fetchQuiz(cursor) 호출</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.5)", margin: 0, lineHeight: 1.5 }}>다음 묶음을 백그라운드에서 가져옴</p>
          </div>
          <div style={{ flex: 1, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", padding: "9px 13px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#059669", marginBottom: "3px" }}>id 기준 중복 제거 후 병합</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.5)", margin: 0, lineHeight: 1.5 }}>Set(prev ids)로 신규 항목만 추가</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoicePoolDiagram() {
  return (
    <div style={{ borderRadius: "14px", border: "1px solid rgba(155,142,196,0.18)", background: "rgba(155, 142, 196, 0.04)", padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7B6FA6", marginBottom: "18px" }}>
        아키텍처 — 보기(오답) 풀 관리
      </p>

      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Pool visual */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>보기 풀 상태</p>
          <div style={{ background: "#fff", border: "1px solid rgba(155,142,196,0.25)", borderRadius: "10px", overflow: "hidden" }}>
            {[
              { label: "초기 로드", value: "INITIAL_SIZE개", color: "#059669" },
              { label: "문항 소비", value: "보기 3개 → 소모", color: "rgba(20,18,40,0.45)" },
              { label: "소모 추적", value: "answeredCount++", color: "rgba(20,18,40,0.45)" },
              { label: "보충 조건", value: "answeredCount % 50 === 0", color: "#dc2626" },
              { label: "보충 실행", value: "ensureChoicePool(INITIAL_SIZE)", color: "#7B6FA6" },
            ].map(({ label, value, color }, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", padding: "7px 12px", borderBottom: i < 4 ? "1px solid rgba(155,142,196,0.12)" : undefined, alignItems: "baseline" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(20,18,40,0.35)", minWidth: "60px", flexShrink: 0 }}>{label}</span>
                <code style={{ fontFamily: "monospace", fontSize: "0.7rem", color }}>{value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Why needed */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>왜 필요한가</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "8px", padding: "9px 12px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#dc2626", marginBottom: "3px" }}>문제</p>
              <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.6)", margin: 0, lineHeight: 1.55 }}>4지선다 오답 3개를 매번 API로 받으면 문항 소비마다 요청 발생</p>
            </div>
            <div style={{ background: "rgba(155,142,196,0.06)", border: "1px solid rgba(155,142,196,0.18)", borderRadius: "8px", padding: "9px 12px" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7B6FA6", marginBottom: "3px" }}>해결</p>
              <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.6)", margin: 0, lineHeight: 1.55 }}>보기 풀을 로컬에 유지하고 <Inline>REPLENISH_INTERVAL</Inline>(50문항) 단위로만 보충 → 요청 횟수 1/50로 감소</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Content ─────────────────────────────────────────────────────────────

const HERO_TITLE_SIZE_FULL = 72;
const HERO_TITLE_SIZE_INLINE = 48;
const HERO_SUB_SIZE = 19;

function HeroContent() {
  const heroLayout = useHeroLayout();
  const isInline = heroLayout === "inline-landscape" || heroLayout === "inline-portrait";
  const titleSize = isInline ? HERO_TITLE_SIZE_INLINE : HERO_TITLE_SIZE_FULL;

  return (
    <>
      <h1 style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02, color: "var(--doc-ink)", margin: "0 0 18px" }}>
        hanzawa-kanji
      </h1>
      <p style={{ fontSize: HERO_SUB_SIZE, color: "var(--doc-ink-2)", fontWeight: 400, lineHeight: 1.55, margin: "0 0 32px", maxWidth: 640 }}>
        일본 상용한자 학습 서비스 — 커서 페이지네이션과 Prefetch로 체감 지연을 제거하다.
      </p>
      <DocMeta items={[
        { key: "역할", value: "개인 프로젝트" },
        { key: "기간", value: "2025.03 — 2025.04 (코어), 2026.04 (UI 리디자인)" },
        { key: "스택", value: (
          <StackRow>
            {["Kotlin", "Spring Boot", "React", "JavaScript", "커서 페이지네이션", "Prefetch"].map((t) => (
              <StackChip key={t} label={t} />
            ))}
          </StackRow>
        )},
      ]} />
      <ActionRow>
        <DetailActionButton variant="primary" icon={<Github size={15} />} label="GitHub" href="https://github.com/mindaaaa/hanzawa-kanji-web" />
      </ActionRow>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function HanzawaKanjiDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName="hanzawa-kanji"
      toc={TOC}
      tocClassName="kanji-toc"
      heroContent={<HeroContent />}
      heroVideo={{
        layout: "inline-landscape",
        projectName: "hanzawa-kanji",
        single: {
          src: "/videos/hanzawa-kanji/demo.webm",
          srcFallback: "/videos/hanzawa-kanji/demo.mp4",
        },
      }}
      onBack={onBack}
      accent="#f59e0b"
    >

      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="kanji-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>학습 몰입을 끊는 두 가지 지점</H2>

        <Lead>
          닫힌 데이터셋(상용한자 2,136자)이 학습 도구에 본질적으로 유리한 점은 두 가지다 —
          '학습 진도 = 본 문항 수 / 2,136'으로 진도가 명확히 정의되고, 서버가 데이터를 동적으로 생산할 필요가 없어 정적 앱 구조까지 갈 수 있다.
          cursor·prefetch는 무한 모드 도메인 자체의 특성에서 나온 결정이지만, 닫힌 데이터셋이 모든 결정의 안정적 토대가 됐다.
        </Lead>

        <DiscoveryTimeline
          title="발견 순서 — 같은 한자 두 번 노출 사고에서 보충 주기 분리까지"
          steps={[
            {
              num: "Step 1",
              eyebrow: "첫 사고",
              title: "스터디 → 랜덤 모드 전환에서 같은 한자가 두 번 노출됐다",
              metas: [
                { key: "수정", body: <>다음 리스트가 오면 새로 온 것만 랜덤 돌리도록 변경 — 이 경험으로 무한 모드 전체를 cursor 기반으로 처음부터 설계했다.</> },
              ],
            },
            {
              num: "Step 2",
              eyebrow: "보기 풀",
              title: "PoC 직접 학습 중 같은 오답이 자주 반복돼 학습 변별력이 떨어졌다",
              metas: [
                { key: "분리", body: <>보충 주기(<Inline>REPLENISH_INTERVAL = 50</Inline>)와 풀 크기(<Inline>INITIAL_SIZE = 200</Inline>)를 분리 — 보충은 학습 리듬에 맞추되, 풀 크기는 다양성 확보를 위해 더 크게.</> },
              ],
            },
            {
              num: "Step 3",
              eyebrow: "확장",
              title: "이 학습 도구의 데이터 규모 감각이 다음 결정에 적용됐다",
              isFinal: true,
              metas: [
                { key: "이어짐", body: <>2,136건을 한 번에 다뤄도 부담 없다는 감각이 Locus 메모리 거버넌스(상한 1,000건) 결정의 직접 근거가 됐다.</> },
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
          학습 몰입을 끊는 두 지점
        </p>
        <BulletList items={[
          <><strong className="text-foreground">온보딩 이탈:</strong> 가입·동기화가 느리면 학습 시작 전 이탈이 발생한다. 접속 후 3초 이내 학습 진입을 목표로.</>,
          <><strong className="text-foreground">무한 퀴즈 몰입 저해:</strong> 문항 소진 때마다 로딩이 뜨면 집중이 끊긴다. 체감 지연 0ms 목표.</>,
          <><strong className="text-foreground">offset 한계:</strong> RANDOM 모드의 세션별 동일 순서 요구를 offset 기반은 중간 삽입 시 흔들린다.</>,
          <><strong className="text-foreground">보기 풀 고갈:</strong> 4지선다 오답을 매 문항마다 API로 받으면 요청 폭증 + 장시간 학습 시 풀 고갈.</>,
        ]} />

        <Callout label="제약 조건">
          상용한자는 약 <strong>2,136자</strong>로 데이터셋이 닫혀 있다 — 전체 크기를 알 수 있으므로 인메모리·Prefetch 전략을 충분히 활용할 수 있다.
        </Callout>
      </DetailSection>

      <SectionGap>

      {/* ── 02. 고민한 방안 ── */}
      <DetailSection id="kanji-ideation">
        <SectionDivider number="02" label="고민한 방안" />
        <H2>페이지네이션과 Prefetch 타이밍, 두 축의 트레이드오프</H2>

        <Lead>
          네 가지 방안을 비교했다. 순서 안정성과 체감 지연을 동시에 달성하기 위해
          커서 기반 페이지네이션과 잔여 N개 이하 Prefetch를 조합하는 방향을 선택했다.
        </Lead>

        <GroupBox>
          <ChosenGrid cols={2}>
            <ChosenCard
              letter="B"
              title="커서(다음 시작 id) + limit+1 조회"
              pros="순서 안정, hasMore 판단 쉬움"
              cons="API·클라 계약을 명확히 문서화해야 함"
            />
            <ChosenCard
              letter="D"
              title="잔여 N문항 이하에서 prefetch"
              pros="체감 0에 가깝게 유지"
              cons="중복 제거·커서 상태 관리 필요"
            />
          </ChosenGrid>

          <ExcludedHeading />
          <ExcludedRow letter="A" title="offset 기반 페이지" cons="데이터 변경 시 페이지 일관성 붕괴" />
          <ExcludedRow letter="C" title="문제 소진 때마다만 fetch" cons="네트워크 라운드트립이 UX를 자름" />

          <DiscoveryBlock>
            무한 모드가 누적 컨텍스트 모델이라 '마지막으로 본 id 다음부터'라는 cursor 계약이 본질에 정합 — offset은 한 번도 시도하지 않았다.
            C는 정답 검증 동작을 확인하려 빠르게 넘기다 매 문항 API 호출이 따라붙는 걸 발견하고, '네트워크가 끊기면 흐름이 그대로 끊긴다'는 위험이 더 커서 prefetch로 전환했다.
            <Inline>REPLENISH_INTERVAL = 50</Inline>은 타깃 시나리오 '아침 출근길 버스 1시간 = 30~50문항'과 같은 리듬으로 잡아, 한 세션 끝날 무렵 자연스럽게 보충되는 흐름.
          </DiscoveryBlock>
        </GroupBox>

        <p style={{ fontSize: 14, color: "var(--doc-ink-2)", lineHeight: 1.7, margin: "20px 0 0" }}>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--doc-accent)",
              marginRight: 12,
            }}
          >
            결정
          </span>
          B + D 조합 — 커서로 순서 안정성, 잔여 5문항 prefetch로 체감 지연 제거. 서버는 quizId 시드 셔플로 세션 일관성을 보장한다.
        </p>
      </DetailSection>
      </SectionGap>

      <SectionGap>

      {/* ── 03. 해결 및 구현 ── */}
      <DetailSection id="kanji-solution">
        <SectionDivider number="03" label="해결 및 구현" />
        <H2>커서 페이지네이션 + Prefetch + 보기 풀 관리</H2>

        {/* 3-1 Cursor pagination */}
        <H3>3-1. 서버 — limit+1 패턴으로 커서 생성</H3>
        <Lead>
          요청된 limit보다 한 건을 더 조회한다. 결과가 <Inline>limit+1</Inline>건이면 다음 페이지가 있으므로
          마지막 항목의 id를 cursor로 내려보내고, limit+1건 미만이면 cursor를 null로 반환한다.
          추가 COUNT 쿼리 없이 <Inline>hasMore</Inline>를 O(1)로 판별한다.
        </Lead>

        <CursorPaginationDiagram />

        <CodeBlock language="kotlin" filename="KanjiService.kt" code={`// limit+1 조회로 다음 커서 존재 여부 판별 — 추가 COUNT 쿼리 불필요
val refinedLimit = limit + 1
val kanjiList = repository.list(
  limit = refinedLimit,
  quizId = dto.quizId,
  mode = mode,
  cursor = cursor
)

return if (kanjiList.size == refinedLimit) {
  val lastOne = kanjiList.last()
  ListResponseDto(
    items = kanjiList.take(limit), // 실제 반환: limit건
    cursor = lastOne.id,           // 다음 커서: limit+1번째 id
    totalCount = totalCount
  )
} else {
  ListResponseDto(kanjiList, cursor = null, totalCount = totalCount)
}`} />

        {/* 3-2 Prefetch */}
        <H3>3-2. 클라이언트 — 잔여 5문항 이하 시 Prefetch</H3>
        <Lead>
          <Inline>quizIndex</Inline>가 현재 풀의 끝에서 5개 이하로 가까워지면 자동으로 다음 묶음을 요청한다.
          사용자가 문항 소진을 느끼기 전에 로딩이 완료되어 체감 지연이 없다.
          fetch 후에는 id 기준 중복 제거를 거쳐 리스트에 병합한다.
        </Lead>

        <PrefetchTimingDiagram />

        <CodeBlock filename="pages/InfiniteMode.jsx — prefetch 트리거" code={`// 잔여 슬롯 5 이하에서 다음 묶음 prefetch
useEffect(() => {
  const shouldPrefetchMore =
    quizList.length > 0 && quizIndex >= quizList.length - 5;
  if (shouldPrefetchMore) fetchQuiz();
}, [quizIndex, quizList]);`} />

        <CodeBlock filename="useQuizEngine.js — 중복 제거 병합" code={`// fetch 완료 후 id 기준 중복 제거 → 리스트에 병합
setQuizList((prev) => {
  const existingIds = new Set(prev.map((item) => item.id));
  const newItems = data.items.filter((item) => !existingIds.has(item.id));
  return [...prev, ...shuffle(newItems)]; // 셔플 후 추가
});`} />

        {/* 3-3 Choice pool */}
        <H3>3-3. 보기(오답) 풀 — 간격 기반 보충</H3>
        <Lead>
          4지선다 오답 3개를 매 문항마다 API로 받으면 요청이 폭증한다.
          대신 보기 풀을 로컬에 유지하고, 답한 문항 수가
          <Inline>REPLENISH_INTERVAL</Inline>(50문항) 배수에 도달할 때만 풀을 다시 채운다.
          요청 횟수를 문항 수 대비 1/50로 줄이면서 보기 고갈을 늦춘다.
        </Lead>

        <ChoicePoolDiagram />

        <CodeBlock filename="useQuizEngine.js — 보기 풀 보충" code={`// answeredCount가 REPLENISH_INTERVAL(50) 배수일 때 보기 풀 보충
useEffect(() => {
  const shouldRefetchPool =
    answeredCount > 0 && answeredCount % Choice.REPLENISH_INTERVAL === 0;
  if (shouldRefetchPool && !loading) {
    ensureChoicePool(Choice.INITIAL_SIZE);
  }
}, [answeredCount, loading, choicePool]);`} />

        <Callout>
          <strong>설계 원칙:</strong> 세 최적화(커서 페이지네이션, Prefetch, 보기 풀 보충)는 모두 "사용자가 기다리는 순간을 없애는" 같은 방향을 향한다.
          각각의 트리거 조건(<Inline>cursor</Inline>, <Inline>quizIndex</Inline>, <Inline>answeredCount</Inline>)이 독립적이므로 서로 간섭하지 않는다.
        </Callout>
      </DetailSection>
      </SectionGap>

      <SectionGap>

      {/* ── 04. 결과 ── */}
      <DetailSection id="kanji-result" isLast>
        <SectionDivider number="04" label="결과" />
        <H2>접속 3초 이내 학습 진입, 무한 모드 체감 지연 최소화</H2>

        <Lead>
          커서 기반 페이지네이션으로 순서 안정성을 확보하고, 잔여 5문항 Prefetch와
          50문항 보기 풀 보충으로 체감 지연을 제거했다. 데이터셋이 닫혀 있다는 제약이
          오히려 전략 선택의 여지를 넓혀주었다.
        </Lead>

        <H3>정량 지표</H3>
        <StatCardGrid>
          <StatCard metric="< 3s" label="접속 → 학습 진입" context="가입 없이 세션 시작 — 온보딩 간소화" />
          <StatCard metric="0ms" label="무한 모드 체감 지연" context="잔여 5문항 prefetch로 소진 전 로드 완료" />
          <StatCard metric="1/50" label="보기 API 요청 비율" context="50문항마다 1회 보충" />
        </StatCardGrid>

        <H3>정성적 성과</H3>

        <CategoryBlock num="01" name="사용자 체감" sub="본인이 직접 학습 도구를 사용하며 확인">
          <CategorySingle
            title="prefetch 도입 후 무한 모드에서 끊김 없이 학습이 이어졌다"
            body={<>본인이 막 클릭하며 테스트하다 매 클릭마다 API 호출이 따라붙는 버벅임을 발견했고, 보기 풀 + prefetch 도입 후 와이파이 약한 환경에서도 같은 패턴의 끊김이 사라졌다.</>}
          />
        </CategoryBlock>

        <CategoryBlock num="02" name="1년 후 회고" sub="2026.04 UI 리디자인">
          <CategorySingle
            title="코드보다 사용성이 가장 약했다 — 디자인 시스템 + PWA 정적 앱으로 발전"
            body={<>2,136자 전체를 FE가 직접 들고 있어도 부담 없는 규모라, PWA 정적 앱으로 옮기면 오프라인·모바일 사용성을 동시에 풀 수 있다고 판단. 현재 Installable PWA까지 적용, Service Worker 오프라인 캐싱은 다음 단계.</>}
          />
        </CategoryBlock>

        <CategoryBlock num="03" name="학습 사이클" sub="Locus 메모리 거버넌스 결정으로 이어진 감각">
          <CategorySingle
            title="2,136건을 한 번에 다뤄도 부담 없다는 감각이 Locus 1,000건 결정의 직접 근거"
            body={<>코드 이식이 아니라 데이터 규모 감각의 이식 — 현대 하드웨어에서 1,000건 메모리·렌더링 부담이 거의 없다는 확신을 hanzawa 실험에서 얻었다.</>}
          />
        </CategoryBlock>

        <H3>정직한 한계</H3>
        <LimitationGrid>
          <LimitationCard item="RTT 실측 수치" status="미측정" note="디바이스·환경별 스냅샷은 별도 측정 필요" />
          <LimitationCard item="RANDOM 모드 시드 셔플" status="서버 quizId 기반" note="완전한 무작위성보다 세션 일관성 우선" />
          <LimitationCard item="보기 풀 중복" status="간단한 id Set으로 제거" note="문항 수가 증가하면 더 정교한 중복 제거 필요" />
          <LimitationCard item="오프라인 지원" status="미구현" note="서비스 워커 기반 오프라인 캐싱은 후속 과제" />
        </LimitationGrid>

        <DetailFurtherReading items={FURTHER_READING} />
      </DetailSection>
      </SectionGap>

    </DetailLayout>
  );
}
