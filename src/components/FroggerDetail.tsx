import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import {
  Lead, H2, H3, BulletList, SectionDivider, Callout, Inline,
  DetailTable,
} from "@/components/detail/DetailPrimitives";
import {
  LimitationCard, LimitationGrid,
  StackChip, StackRow, DocMeta,
} from "@/components/detail/DetailCards";
import { CommandFlow, CommandTriggers } from "@/components/detail/CommandFlow";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
import { DiscoveryTimeline } from "@/components/detail/DiscoveryTimeline";
import {
  GroupBox,
  ChosenCard,
  ExcludedHeading, ExcludedRow,
  DiscoveryBlock,
  SplitLayout,
} from "@/components/detail/IdeationVisuals";
import { CategoryBlock, CategorySingle } from "@/components/detail/AchievementCategory";
import { Github } from "lucide-react";

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: "s-context",  label: "상황 및 문제" },
  { id: "s-ideation", label: "고민한 방안" },
  { id: "s-solution", label: "해결 및 구현" },
  { id: "s-result",   label: "결과" },
] as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = "#F0A060";
const HERO_TITLE_SIZE_FULL = 72;
const HERO_TITLE_SIZE_INLINE = 48;
const HERO_SUB_SIZE = 19;

// ─── 계층형 CLAUDE.md 파일 트리 시각화 ────────────────────────────────────────

interface ClaudeMdNode {
  path: string;
  color: string;
  target: string;
  description: string;
}

const CLAUDE_MD_ROOT: ClaudeMdNode = {
  path: "CLAUDE.md",
  color: "#7c6ff7",
  target: "전역 철학",
  description: "실행 ↔ AI ↔ 렌더 3축 분리, 타입 안전성 원칙",
};

const CLAUDE_MD_CHILDREN: ClaudeMdNode[] = [
  {
    path: "app/api/analyze/CLAUDE.md",
    color: "#f59e0b",
    target: "AI 분류 레이어",
    description: "타입·이름이 아니라 '사용 패턴'만으로 알고리즘 분류",
  },
  {
    path: "src/features/execution/CLAUDE.md",
    color: "#10b981",
    target: "Worker 레이어",
    description: "Worker 통신은 ProvaRuntime 클래스 경유, 직접 postMessage 금지",
  },
  {
    path: "src/features/trace/CLAUDE.md",
    color: "#3b82f6",
    target: "Store 레이어",
    description: "mergeTrace() 자동 호출, 수동 병합 금지 / 길이 불일치는 EMPTY_ANNOTATED 패딩",
  },
  {
    path: "src/features/visualization/CLAUDE.md",
    color: "#ec4899",
    target: "Renderer 레이어",
    description: "렌더러는 action만 받고, 색상·스타일은 AI가 결정하지 않는다",
  },
];

function ClaudeMdTreeRow({ node, isLast }: { node: ClaudeMdNode; isLast: boolean }) {
  return (
    <div style={{ marginBottom: isLast ? 0 : 18 }}>
      <div className="flex items-baseline" style={{ gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span
          aria-hidden
          style={{
            fontFamily: "var(--app-font-mono)",
            fontSize: 14,
            color: "var(--doc-ink-4)",
          }}
        >
          └
        </span>
        <code
          style={{
            fontFamily: "var(--app-font-mono)",
            fontSize: 14,
            fontWeight: 700,
            color: node.color,
          }}
        >
          {node.path}
        </code>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            padding: "2px 9px",
            borderRadius: 5,
            background: `${node.color}1f`,
            color: node.color,
          }}
        >
          {node.target}
        </span>
      </div>
      <p
        style={{
          margin: "0 0 0 22px",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--doc-ink-2)",
        }}
      >
        {node.description}
      </p>
    </div>
  );
}

function ClaudeMdTree() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--doc-line)",
        borderRadius: 14,
        padding: "24px clamp(20px, 3vw, 28px)",
        margin: "16px 0 28px",
      }}
    >
      <div className="flex items-baseline" style={{ gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
        <code
          style={{
            fontFamily: "var(--app-font-mono)",
            fontSize: 16,
            fontWeight: 700,
            color: CLAUDE_MD_ROOT.color,
          }}
        >
          {CLAUDE_MD_ROOT.path}
        </code>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            padding: "2px 9px",
            borderRadius: 5,
            background: `${CLAUDE_MD_ROOT.color}1f`,
            color: CLAUDE_MD_ROOT.color,
          }}
        >
          {CLAUDE_MD_ROOT.target}
        </span>
      </div>
      <p
        style={{
          margin: "0 0 0 14px",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--doc-ink-2)",
        }}
      >
        {CLAUDE_MD_ROOT.description}
      </p>

      <hr style={{ border: 0, borderTop: "1px dashed var(--doc-line)", margin: "20px 0" }} />

      {CLAUDE_MD_CHILDREN.map((node, i) => (
        <ClaudeMdTreeRow
          key={node.path}
          node={node}
          isLast={i === CLAUDE_MD_CHILDREN.length - 1}
        />
      ))}
    </div>
  );
}

// ─── Hero content ─────────────────────────────────────────────────────────────

function HeroContent() {
  const heroLayout = useHeroLayout();
  const isInline = heroLayout === "inline-landscape" || heroLayout === "inline-portrait";
  const titleSize = isInline ? HERO_TITLE_SIZE_INLINE : HERO_TITLE_SIZE_FULL;

  return (
    <>
      <h1 style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02, color: "var(--doc-ink)", margin: "0 0 18px" }}>
        Frogger
      </h1>
      <p style={{ fontSize: HERO_SUB_SIZE, color: "var(--doc-ink-2)", fontWeight: 400, lineHeight: 1.55, margin: "0 0 32px", maxWidth: 640 }}>
        AI 알고리즘 시각화 디버거 — "AI가 조용히 계약을 깬다"는 리스크를 파이프라인 문제로 다룬 기록.
      </p>
      <DocMeta items={[
        { key: "역할", value: "AI 협업 인프라 (컨텍스트 관리 · Claude 공통 사용법)" },
        { key: "기간", value: "2026.04" },
        { key: "스택", value: (
          <StackRow>
            {["Claude Code", "CLAUDE.md", "슬래시 커맨드", "Next.js", "TypeScript"].map((t) => (
              <StackChip key={t} label={t} />
            ))}
          </StackRow>
        )},
      ]} />
      <ActionRow>
        <DetailActionButton variant="primary" icon={<Github size={15} />} label="GitHub" href="https://github.com/ultra-ai-dle/frogger" />
      </ActionRow>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FroggerDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName="Frogger"
      accent={ACCENT}
      toc={TOC}
      tocClassName="frogger-toc"
      heroContent={<HeroContent />}
      heroVideo={{
        layout: "inline-landscape",
        projectName: "Frogger",
        single: {
          src: "/videos/frogger/demo.webm",
          srcFallback: "/videos/frogger/demo.mp4",
        },
      }}
      onBack={onBack}
    >
      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="s-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>AI가 조용히 계약을 깬다 — 팀이 같은 Claude를 쓸 때의 리스크</H2>

        <Lead>
          AI 협업이 일반 협업과 본질적으로 다른 점은 <strong className="text-foreground">병목의 위치</strong>다.
          일반 협업에서는 사람의 생각·검증·회의가 진척을 만들지만,
          AI 협업 — 특히 바이브코딩처럼 8일 안에 QA·기획·개발을 다 끝내야 하는 환경 — 에서는 그 사람의 생각이 곧 병목이 된다.
          그래서 사람 중심 워크플로우(예쁜 코드, 정교한 아키텍처)를 그대로 들고 가면 안 된다는 걸 인지했고,
          AI가 막힘 없이 작업할 수 있도록 '필요한 정보를 그때그때 정확한 위치에 적치하는 워크플로우' 자체를 1순위로 설계했다.
        </Lead>
        <Lead>
          1명+AI는 한 사람이 자기 컨텍스트를 책임지면 됐는데, 4명+같은 AI는 새로운 위험이 생겼다.
          사람마다 AI 사용 방식이 달라 도구를 도입해도 안 쓰는 사람은 안 쓰고,
          디렉토리 설계까지 AI에 맡기다 보니 잘못된 위치에 코드가 한 번 자리 잡으면 거기서 이상한 코드가 계속 자라나는 <strong className="text-foreground">공유지의 비극</strong>이 발생했다.
          같은 도구를 쓴다는 사실이 곧 같은 컨텍스트를 공유한다는 뜻은 아니라는 걸, 8일 동안 부딪치며 학습했다.
        </Lead>

        <Lead>
          Frogger는 브라우저에서 Python/JS/Java를 실행하면 AI가 알고리즘을 분류하고 실행 흐름을
          단계별 시각화 + 자연어 해설로 변환하는 3단 파이프라인 제품이다. 바이브코딩 대회 4인
          출전작으로, 팀원 작업 범위가 서로 맞물려 있어 한 명이 프롬프트를 살짝 바꾸면 다른
          사람의 렌더러가 조용히 깨지는 구조적 리스크가 상수였다.
        </Lead>

        <DiscoveryTimeline
          title="발견 순서 — var_mapping 사고에서 자원 충돌 환원까지"
          steps={[
            {
              num: "Step 1",
              eyebrow: "첫 사고",
              title: "var_mapping이 PoC 머지 직후 가장 먼저 터졌다",
              metas: [
                { key: "현상", body: <>큐 알고리즘에 변수명을 스택으로 주면 AI가 변수명에 끌려가 응답 품질이 떨어졌다. 사용자가 어떤 변수명을 써도 일관된 JSON 응답을 줘야 하는데, var_mapping 정의가 맞지 않으면 AI 출력이 어긋났다.</> },
                { key: "원인", body: <>응답이 어긋날 때마다 var_mapping을 손보는 게 일상이었는데, 이걸 누가 수정했는지 다른 팀원·본인도 잊는 패턴이 반복됐다.</> },
              ],
            },
            {
              num: "Step 2",
              eyebrow: "인지",
              title: "시각화는 var_mapping에 의존 → 한 번 깨지면 전체 파이프라인이 같이 무너진다",
              metas: [
                { key: "관찰", body: <>'AI용 문서(CLAUDE.md)와 사람용 문서가 분리돼 있는데, 둘 다 소스 변경에 자동으로 따라오지 않는다'는 공통 패턴이 일찍 보였다.</> },
                { key: "딜레마", body: <>자동화로 따라오게 하면 검증 자체가 무거워져 토큰을 잡아먹고, 그 토큰 비용이 시각화 품질을 깎는다.</> },
              ],
            },
            {
              num: "Step 3",
              eyebrow: "패턴 환원",
              title: "4개 리스크 = '컨텍스트 비대칭과 토큰 예산'이라는 한 자원 충돌",
              isFinal: true,
              metas: [
                { key: "환원", body: <>4개를 '한 사이클의 연쇄'로 묶은 명확한 순간은 없었다. 4개는 처음부터 따로따로 인지됐고, 한 본질로 보인 건 회고 정리 단계에서였다.</> },
                { key: "결론", body: <>모든 리스크가 결국 같은 사이클의 다른 시점에 위치한 자원 충돌로 환원됐다 — 컨텍스트와 토큰을 어떻게 적치하느냐가 전체 품질을 결정한다는 게 다음 AI 협업 파이프라인의 1번 설계 기준이 됐다.</> },
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
          한눈에 본 구조적 리스크
        </p>
        <BulletList
          items={[
            <><strong className="text-foreground">조용한 계약 위반:</strong> AI 응답 필드 하나가 프롬프트 수정으로 빠지면 타입 캐스팅은 통과하고, 해당 필드를 참조하는 패널에서만 늦게 터진다.</>,
            <><strong className="text-foreground">트레이스 병합 무결성:</strong> <Inline>rawTrace</Inline>(실행 결과)와 <Inline>annotated</Inline>(AI 해설) 길이가 다를 때 수동 병합을 허용하면 스텝 인덱스가 어긋나 잘못된 줄에 잘못된 해설이 붙는다.</>,
            <><strong className="text-foreground">반복 검증 비용:</strong> PR마다 lint · typecheck · build · 계약을 사람이 순서대로 돌리면 대회 속도와 상충한다.</>,
            <><strong className="text-foreground">팀 컨텍스트 공유:</strong> 같은 Claude를 쓰는 4명이 "이 레이어에서 무엇이 금지인가"를 매번 말로 설명할 수 없다 — 구조로 강제해야 한다.</>,
          ]}
        />

        <Callout label="핵심 과제">
          <strong>훅으로 강제할 것과 커맨드로 유도할 것의 경계를 어떻게 설계할까?</strong>
          <br />
          "까먹을 수 없는 자동화"와 "의도적으로 호출하는 검증"을 분리하는 것이 출발점이었다.
        </Callout>
      </DetailSection>

      {/* ── 02. 고민한 방안 ── */}
      <SectionGap>
        <DetailSection id="s-ideation">
          <SectionDivider number="02" label="고민한 방안" />
          <H2>컨텍스트 전달 · 검증 집행 두 축으로 선택지를 비교</H2>

          <Lead>
            팀 내 AI 협업을 파이프라인화하려면 두 가지 독립적인 결정이 필요했다 —
            <strong className="text-foreground"> 컨텍스트 전달 전략</strong>(Claude가 작업 레이어의 규칙을 어떻게 아는가)과
            <strong className="text-foreground"> 검증 집행 전략</strong>(계약 위반을 언제 어떻게 차단하는가).
          </Lead>

          <H3>① 컨텍스트 전달 전략</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="B"
                  title="계층형 CLAUDE.md (루트 + 4 레이어)"
                  pros="작업 레이어의 강제 규칙만 자동 로드, 코드와 함께 이동"
                  cons="문서 신선도 관리 비용 — 설계 변경 시 md도 같이 움직여야 함"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="A" title="루트 단일 CLAUDE.md" cons="레이어 규칙 간섭, 토큰 비대화" stacked />
                  <DiscoveryBlock>
                    루트 CLAUDE.md는 무조건 읽히는 구조라, 처음엔 모든 작업에 영향 줄 수 있는 코드 컨벤션만 두고 시작했다.
                    그런데 4명이 동시 개발하면서 디렉토리 구조가 빠르게 늘어나고 파일도 커졌고, Claude가 작업과 무관한 영역까지 컨텍스트로 분석하면서 토큰을 잡아먹고 응답 속도도 떨어졌다.
                    그렇다고 루트에 아키텍처를 넣자니, 작업 중인 feature와 무관한 영역의 아키텍처까지 매번 함께 로드되는 문제가 생겼다.
                    결국 '레이어별로 필요한 규칙만 그 레이어 디렉토리에 둔다'는 계층형 분리로 전환했다 — 작업 위치에 따라 자동으로 관련된 컨텍스트만 로드되도록.
                  </DiscoveryBlock>
                </>
              }
            />
          </GroupBox>

          <H3>② 검증 집행 전략</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="D"
                  title="슬래시 커맨드 기반 정적 검증 + Store 강제"
                  pros="런타임 이전에 계약 불일치 차단, 수동 병합 경로가 타입상 존재하지 않음"
                  cons="커맨드는 사람이 호출해야 함 — 팀 스케일에서 호출 공백 위험"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="C" title="런타임 Zod 검증만" cons="터진 후 catch — 사이클 낭비" stacked />
                  <DiscoveryBlock>
                    AI 협업의 본질상 응답 품질을 높이려면 프롬프팅을 계속 수정해야 하는데,
                    누군가 응답 스키마와 어긋나는 수정을 하면 전혀 관련 없어 보이는 다른 영역에서 사고가 터진다.
                    Zod 런타임만으로는 터진 후에야 catch되고, 디버깅이 엉뚱한 곳에서 시작돼 시간이 낭비된다.
                    그래서 검증을 단계별로 나눠 — 프롬프트 변경은 <Inline>/prompt-diff</Inline>로,
                    트레이스 무결성은 <Inline>/trace-validate</Inline>로,
                    PR 머지 직전엔 <Inline>/pr-ready</Inline> 체인으로 — 사고가 터지기 전 단계별로 차단하는 구조로 갔다.
                  </DiscoveryBlock>
                </>
              }
            />
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
            B와 D를 조합 — "까먹을 수 없는 것(계층형 md)"과 "의도적으로 호출하는 것(슬래시 커맨드)"을
            명확히 분리. 커맨드 공백 리스크는 §04의 회고 지점으로 의식적으로 남겨 두었다.
          </p>

          <div
            style={{
              border: "1px solid var(--doc-line)",
              borderRadius: 12,
              margin: "20px 0 0",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 18px",
                background: "var(--doc-bg-soft)",
                borderBottom: "1px solid var(--doc-line)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--doc-ink)",
                  background: "#fff",
                  border: "1px solid var(--doc-line)",
                  padding: "2px 9px",
                  borderRadius: 4,
                }}
              >
                Day 6
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--doc-ink)",
                }}
              >
                /docs-audit 추가 결정
              </span>
            </div>
            <p
              style={{
                margin: 0,
                padding: "16px 18px",
                fontSize: 13.5,
                lineHeight: 1.7,
                color: "var(--doc-ink-2)",
              }}
            >
              기능별 CLAUDE.md 분리는 잘 작동했지만, 후반으로 갈수록 '기획안을 던져 개발하는'
              구조로 바뀌면서 새로운 문제가 보였다. 아키텍처가 바뀌었는데 개발자가 인지하지 못하고,
              CLAUDE.md는 이전 아키텍처와 이전 기획을 참고하면서 응답이 점점 어긋나기 시작했다.
              6일차쯤 Claude가 계속 이전 기획안을 언급하는 걸 보고 진단해보니 이 패턴이 명확했다.
              원래 'CLAUDE.md는 담당 개발자가 업데이트한다'는 정책이었는데, 사람의 인지에 의존하는
              한 같은 문제가 반복될 거라 판단 → <Inline>/docs-audit</Inline> 커맨드를 도입해
              문서 신선도 검증 자체를 커스텀 커맨드로 옮겼다.
            </p>
          </div>
        </DetailSection>
      </SectionGap>

      {/* ── 03. 해결 및 구현 ── */}
      <SectionGap>
        <DetailSection id="s-solution">
          <SectionDivider number="03" label="해결 및 구현" />
          <H2>계층형 계약 · 슬래시 커맨드 · 의사결정 로그 세 장치를 한 세트로</H2>

          {/* (a) 계층형 CLAUDE.md */}
          <H3>계층형 CLAUDE.md — "설정"이 아니라 "레이어 계약"</H3>
          <Lead>
            Claude Code가 파일을 열 때 상위 디렉토리의 <Inline>CLAUDE.md</Inline>를 자동 로드하는
            특성을 "레이어별 금지·강제 규칙" 주입 채널로 재해석했다. 루트는 전역 철학만 담고,
            각 feature 디렉토리에는 그 레이어에서만 유효한 강제 규칙만 둔다.
          </Lead>

          <ClaudeMdTree />

          {/* (b) 슬래시 커맨드 */}
          <H3>슬래시 커맨드 — AI 프롬프트 변경을 "타입 시스템의 이벤트"로</H3>
          <Lead>
            10개 슬래시 커맨드로 일상 워크플로우와 변경 파일 유형별 전용 검증을 분리했다.
            커맨드는 포기해도 되는 것이 아니라, "의도적으로 호출하는 검증"의 고정된 입구
            역할을 맡는다.
          </Lead>

          <CommandFlow
            title="일상 개발 플로우"
            nodes={[
              { label: "/test",      description: "테스트 작성" },
              { label: "/review",    description: "품질 · 리팩토링" },
              { label: "/qa",        description: "체크리스트" },
              { label: "/commit",    description: "커밋 메시지" },
              { label: "/docs",      description: "문서 · JSDoc" },
              { label: "/pr-ready",  description: "PR 최종 게이트", highlight: true },
            ]}
          />

          <CommandTriggers
            title="변경 유형 → 전용 검증"
            branches={[
              { trigger: "타입 · 인터페이스",  command: "/refactor-audit" },
              { trigger: "AI 프롬프트",        command: "/prompt-diff",   highlight: true },
              { trigger: "Worker · Trace",    command: "/trace-validate", highlight: true },
              { trigger: "Markdown 문서",      command: "/docs-audit" },
            ]}
          />

          <Callout>
            <Inline>/prompt-diff</Inline> · <Inline>/trace-validate</Inline> · <Inline>/pr-ready</Inline>가
            "계약을 런타임 이전에 차단"하는 세 축이다. 나머지 커맨드는 팀원 간 맥락 판단이 필요한
            단계(커밋 메시지 톤, QA 시나리오, 리뷰 시점 등)를 표준화한다.
          </Callout>

          {/* (c) 의사결정 로그 */}
          <H3>토큰 절약 의사결정 로그 — 미채택도 같은 장소에 박제</H3>
          <Lead>
            최적화 가설이 많아질수록 "실험 → 롤백 → 근거 휘발"의 반복이 비용이 된다. 채택과
            미채택을 같은 문서(<Inline>prompts/optimization-cash-token/</Inline>)에 나란히 남겨
            "결정된 과거"로 고정했다.
          </Lead>

          <DetailTable
            headers={["항목", "판정", "근거"]}
            rows={[
              {
                cells: ["localStorage LRU 캐시", "채택", "동일 코드 재실행 시 AI 호출 0 토큰. 키는 코드 텍스트 해시."],
                chosen: true,
              },
              {
                cells: ["에러 스텝 우선 explain", "채택", "전체 trace 대신 에러 ±3 스텝만 전송. 품질 유지 + 토큰 극소."],
                chosen: true,
              },
              {
                cells: ["varTypes 정규화", "미채택", "정규화로 hit율은 오르지만 false hit 리스크가 더 커서 기각."],
              },
              {
                cells: [<>systemInstruction 분리 캐싱</>, "미채택", <>Gemini <Inline>generateContent</Inline>가 해당 캐싱 미지원. 실효 없음.</>],
              },
              {
                cells: ["실행라인 필터링", "미채택", "post-processing 의존성이 모든 consumer로 번져 기각."],
              },
            ]}
          />
        </DetailSection>
      </SectionGap>

      {/* ── 04. 결과 ── */}
      <SectionGap>
        <DetailSection id="s-result">
          <SectionDivider number="04" label="결과" />
          <H2>실제로 돌려보니 1번 변수는 md의 신선도였다</H2>

          <Lead>
            자동화·토큰 절약·컨텍스트 분리 같은 상위 개념보다,
            <strong className="text-foreground"> 설계 변경 순간에 계약 문서가 코드와 함께 움직이는가</strong>가
            전체 품질을 결정했다. 이 관찰이 Frogger의 가장 큰 소득이다 —
            다음 AI 협업 파이프라인의 1번 설계 기준이 여기서 나왔다.
          </Lead>

          <CategoryBlock num="01" name="팀 변화" sub="질문이 사라진 흔적">
            <CategorySingle
              title="다른 팀원의 파트 설계가 궁금해질 때 별도 질문 없이 흐름을 따라갈 수 있게 됐다"
              body={<>바이브코딩 특성상 다른 팀원의 파트 설계가 궁금해지는 순간이 잦았는데, 계층별 CLAUDE.md에 레이어별 아키텍처가 박혀 있어 별도 질문 없이 흐름을 따라갈 수 있었다. 또한 Claude의 plan 모드는 컨텍스트가 길어질수록 응답 품질이 떨어지는 한계가 있는데, 레이어별로 분리하면서 작업 범위에 맞는 컨텍스트만 로드돼 plan 모드 응답성도 함께 개선됐다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="02" name="협업 책임 이동" sub="/pr-ready 체인 도입 후">
            <CategorySingle
              title="버그 책임이 '발견자 → 작성자'로 이동했다"
              body={<>도입 전에는 일단 PR을 날리고 문제가 생기면 발견한 사람이 고치는 패턴이었는데, /pr-ready 체인 도입 후 PR 작성자가 머지 전에 자가 검증을 끝내게 되면서 책임 위치가 명확해졌다. 자기 작업 컨텍스트가 살아있는 상태에서 수정하니 수정 품질도 올라갔고, 버그 발생 자체가 확연히 줄었다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="03" name="의사결정 비용" sub="채택 2 · 미채택 3 같은 문서">
            <CategorySingle
              title="'이 결정 왜 이렇게 됐어요?' 같은 질문이 거의 안 나왔다"
              body={<>Feature별로 영역을 나눈 덕에 다른 팀원의 결정 근거가 궁금할 때 별도 질문 없이 해당 영역의 의사결정 로그(<Inline>prompts/optimization-cash-token/</Inline> 같은 곳)를 보면 답이 나왔다. 채택·미채택이 같은 문서에 박제돼 있어서 같은 최적화 시도를 재검토하는 비용을 없앴다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="04" name="메타 인식" sub="공유지의 비극과 자원 충돌 환원">
            <CategorySingle
              title="같은 도구를 쓴다는 사실이 곧 같은 컨텍스트 공유를 의미하지 않는다"
              body={<>1명+AI는 한 사람이 자기 컨텍스트를 책임지면 됐는데, 4명+같은 AI는 사람마다 사용 방식이 달라 도구를 도입해도 안 쓰는 사람은 안 쓰고, 디렉토리 설계까지 AI에 맡기다 보니 잘못된 위치에 코드가 한 번 자리 잡으면 거기서 이상한 코드가 계속 자라나는 <strong className="text-foreground">공유지의 비극</strong>이 발생했다. 4개 리스크가 결국 '컨텍스트 비대칭과 토큰 예산'이라는 한 자원 충돌로 환원된다는 회고가 다음 AI 협업 파이프라인의 1번 설계 기준이 됐다.</>}
            />
          </CategoryBlock>

          <H3>관찰된 한계 → 다음 설계 기준</H3>
          <LimitationGrid>
            <LimitationCard
              item="CLAUDE.md 신선도"
              status="다음엔 PR 필수 변경 정책으로 강제"
              note="레이어 코드가 바뀌면 해당 CLAUDE.md 동반 수정이 없는 PR은 블록. 신선도를 사람의 기억이 아니라 파이프라인의 강제로."
            />
            <LimitationCard
              item="훅의 스케일 한계"
              status="다음엔 변경 경로 기반 선택적 훅 + 로컬↔CI 분리"
              note="모든 PR이 모든 훅을 통과하는 구조는 규모에 비례해 비용이 기하급수. glob 기준으로 훅을 선택 적용하고 무거운 검증은 CI로."
            />
            <LimitationCard
              item="커맨드 의존의 휴먼 에러"
              status="다음엔 '까먹으면 문제 되는 것'을 훅·CI로 이관"
              note="혼자 쓸 땐 강했지만 팀 스케일에선 '쓰는 사람만 쓴다'. 맥락 판단이 필요한 것만 커맨드로 남기고 나머지는 자동화 층으로 내린다."
            />
          </LimitationGrid>

          <Callout label="통합 메시지">
            한계는 해결하지 못한 실패가 아니라 <strong>다음 투자 기준을 얻은 지점</strong>이다.
            Frogger의 파이프라인 자체보다, "md 신선도가 파이프라인의 1번 변수였다"는 관찰이
            다음 프로젝트로 가져갈 진짜 자산이다.
          </Callout>
        </DetailSection>
      </SectionGap>
    </DetailLayout>
  );
}
