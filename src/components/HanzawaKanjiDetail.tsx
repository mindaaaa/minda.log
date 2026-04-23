import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import { Lead, H2, H3, BulletList, SectionDivider, Callout, Inline, DetailTable, CodeBlock } from "@/components/detail/DetailPrimitives";
import { OptionCard, OptionCardGrid, StatCard, StatCardGrid, AchievementCard, AchievementGrid, LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
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
        { key: "기간", value: "2025.03 — 2025.04" },
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
          일본 상용한자 2,136자를 학습하는 서비스다. 데이터셋이 닫혀 있다는 특성 덕에
          페이지네이션·Prefetch 전략을 주도적으로 선택할 수 있었고,
          온보딩 이탈과 무한 퀴즈 몰입 저해라는 두 문제를 동시에 해결해야 했다.
        </Lead>

        <BulletList items={[
          <><strong className="text-foreground">온보딩 이탈:</strong> 가입·동기화가 느리면 학습 시작 전 이탈이 발생한다. 접속 후 3초 이내 학습 진입을 목표로 삼았다.</>,
          <><strong className="text-foreground">무한 퀴즈 몰입 저해:</strong> 무한 모드에서 문항 소진 때마다 로딩이 뜨면 집중이 끊긴다. 체감 지연 0ms를 목표로 했다.</>,
          <><strong className="text-foreground">offset 페이지네이션 한계:</strong> RANDOM 모드에서 세션별 동일 순서가 요구되는데, offset 기반은 중간 삽입 시 페이지 경계가 흔들려 같은 항목이 중복 노출되거나 누락될 수 있다.</>,
          <><strong className="text-foreground">보기(오답) 풀 고갈:</strong> 4지선다 오답 후보를 매 문항마다 API로 받으면 요청이 폭증하고, 장시간 학습 시 보기가 고갈된다.</>,
        ]} />

        <Callout label="제약 조건">
          상용한자는 약 <strong>2,136자</strong>로 데이터셋이 닫혀 있다. 전체 크기를 알 수 있으므로 인메모리·Prefetch 전략을 충분히 활용할 수 있다.
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

        <OptionCardGrid>
          <OptionCard letter="A" title="offset 기반 페이지" pros="단순" cons="데이터 변경 시 페이지 일관성 붕괴" />
          <OptionCard letter="B" title="커서(다음 시작 id) + limit+1 조회" pros="순서 안정, hasMore 판단 쉬움" cons="API·클라 계약을 명확히 문서화해야 함" chosen />
          <OptionCard letter="C" title="문제 소진 때마다만 fetch" pros="구현 단순" cons="네트워크 라운드트립이 UX를 자름" />
          <OptionCard letter="D" title="잔여 N문항 이하에서 prefetch" pros="체감 0에 가깝게 유지" cons="중복 제거·커서 상태 관리 필요" chosen />
        </OptionCardGrid>

        <Callout>
          <strong>선택: B + D</strong> — 커서 기반으로 순서 안정성을 확보하고, 잔여 5문항 이하 시점에 다음 묶음을 미리 가져와 체감 지연을 제거한다.
          서버에서 quizId 시드로 셔플 순서를 고정해 세션별 일관성을 보장한다.
        </Callout>
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

        <CodeBlock filename="useQuizEngine.js — prefetch 트리거" code={`// 잔여 슬롯 5 이하에서 다음 묶음 prefetch
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
        <AchievementGrid>
          <AchievementCard title="온보딩 간소화" description="가입 없이 세션 시작 — 접속 후 즉시 학습 가능한 흐름." />
          <AchievementCard title="수백 문항 연속 학습" description="잔여 5문항 Prefetch와 보기 풀 보충이 조합되어 장시간 세션에서도 끊김 없는 경험 제공." />
          <AchievementCard title="전략 레퍼런스 축적" description={<>"데이터 규모에 따라 인메모리·Prefetch 전략이 달라진다"는 의사결정 경험이 이후 프로젝트(Locus 메모리 거버넌스 등)의 레퍼런스가 됐다.</>} />
          <AchievementCard title="풀스택 경험" description="Kotlin/Spring Boot 서버와 React 클라이언트를 함께 설계해, API 계약이 UX에 직접 영향을 준다는 점을 체득." />
        </AchievementGrid>

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
