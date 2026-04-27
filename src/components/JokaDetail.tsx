import React from "react";

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
import { FileTree, FileTreeItem } from "@/components/detail/FileTree";
import {
  GroupBox,
  ChosenCard,
  ExcludedHeading, ExcludedRow,
  DiscoveryBlock,
  SplitLayout,
} from "@/components/detail/IdeationVisuals";
import { CategoryBlock, CategoryList, CategorySingle } from "@/components/detail/AchievementCategory";
import { Github, Figma } from "lucide-react";

import jokaSelectionMode from "@assets/images/joka-selection-mode.png";

// ─── Further Reading data ────────────────────────────────────────────────────

const FURTHER_READING: FurtherReadingItem[] = [
  {
    type: "Wiki",
    title: "릴리즈 프로세스 가이드",
    description: "버전 관리 · 배포 파이프라인 · 릴리즈 체크리스트",
    href: "https://github.com/mindjuk/joka/wiki/%EB%A6%B4%EB%A6%AC%EC%A6%88-%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%EA%B0%80%EC%9D%B4%EB%93%9C",
  },
];

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: "s-context",   label: "상황 및 문제" },
  { id: "s-ideation",  label: "고민한 방안" },
  { id: "s-solution",  label: "해결 및 구현" },
  { id: "s-result",    label: "결과" },
] as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = "#7c6ff7";
const HERO_TITLE_SIZE_FULL = 72;
const HERO_TITLE_SIZE_INLINE = 48;
const HERO_SUB_SIZE = 19;

// ─── 03 섹션 데이터 — 4계층 로거 + FSD 6 레이어 ────────────────────────────

const LOGGER_LAYERS: FileTreeItem[] = [
  { path: "log.expected", color: "#10b981", target: "Console only", description: "예상된 흐름 — 운영 노이즈 없음" },
  { path: "log.business", color: "#3b82f6", target: "Console + Sentry(info, 샘플링)", description: "비즈니스 이벤트 — BUSINESS_SAMPLE_RATE 기준 보조 전송" },
  { path: "log.operational", color: "#f59e0b", target: "Sentry(warning, allowlist)", description: "허용 메시지 Allowlist 통과 시에만 전송" },
  { path: "log.bug", color: "#ef4444", target: "Sentry(error, captureException)", description: "미처리 예외·ErrorBoundary → 즉시 보고" },
];

const FSD_ROOT: FileTreeItem = {
  path: "apps/web/src/",
  color: "#7c6ff7",
  target: "엔트리",
  description: "프로바이더·스타일 — QueryClientProvider, ErrorBoundary, 라우터",
};

const FSD_LAYERS: FileTreeItem[] = [
  { path: "entities/", color: "#6366f1", target: "도메인 모델", description: "도메인 모델 단위 (Media, User 등)" },
  { path: "features/", color: "#8b5cf6", target: "인터랙션", description: "사용자 인터랙션 단위 슬라이스" },
  { path: "pages/", color: "#a78bfa", target: "라우트", description: "라우트에 대응하는 페이지 컴포넌트" },
  { path: "widgets/", color: "#c4b5fd", target: "복합 UI", description: "재사용 가능한 복합 UI 블록" },
  { path: "shared/", color: "#9ca3af", target: "공통 유틸", description: "logger, sentry, QueryClient 등 공통 유틸" },
];

// ─── Hero content ─────────────────────────────────────────────────────────────

function HeroContent() {
  const heroLayout = useHeroLayout();
  const isInline = heroLayout === "inline-landscape" || heroLayout === "inline-portrait";
  const titleSize = isInline ? HERO_TITLE_SIZE_INLINE : HERO_TITLE_SIZE_FULL;

  return (
    <>
      <h1 style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02, color: "var(--doc-ink)", margin: "0 0 18px" }}>
        Joka
      </h1>
      <p style={{ fontSize: HERO_SUB_SIZE, color: "var(--doc-ink-2)", fontWeight: 400, lineHeight: 1.55, margin: "0 0 32px", maxWidth: 640 }}>
        가족 중심 사진 아카이브 PWA — MTTI를 줄이기 위한 관측성 설계와 접근 제어.
      </p>
      <DocMeta items={[
        { key: "역할", value: "Co-founder & Frontend Lead" },
        { key: "기간", value: "2026.01 — 현재" },
        { key: "스택", value: (
          <StackRow>
            {["PWA", "React 19", "TypeScript", "Vite 6", "Sentry", "TanStack Query", "Turborepo"].map((t) => (
              <StackChip key={t} label={t} />
            ))}
          </StackRow>
        )},
      ]} />
      <ActionRow>
        <DetailActionButton variant="primary" icon={<Github size={15} />} label="GitHub" href="https://github.com/mindjuk/joka" />
        <DetailActionButton variant="ghost" icon={<Figma size={15} />} label="Figma" href="https://www.figma.com/design/CMmFH7bo58ly7bQ0mnidNw/Joka---Full-App?node-id=12-10&p=f&t=0ANjWg245DpmzY6A-0" />
      </ActionRow>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function JokaDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName="Joka"
      accent={ACCENT}
      toc={TOC}
      tocClassName="joka-toc"
      heroContent={<HeroContent />}
      heroVideo={{
        layout: "inline-portrait",
        projectName: "Joka",
        single: {
          src: "",
          poster: jokaSelectionMode,
          caption: "선택 모드 — 사진 다중 선택 후 다운로드",
        },
        inDevelopment: true,
      }}
      onBack={onBack}
    >
      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="s-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>"누가, 어느 환경에서, 무엇을 했는지" 추적 불가의 공백</H2>

        <Lead>
          PWA + 폐쇄형 + 소규모 팀 도메인은 OS·브라우저·설치 모드 조합이 무한해 사고 예방이 본질적으로 어렵다.
          가족 사진은 포기할 수 없는 가치라 신뢰가 깎이기 시작하는 순간을 짧게 만드는 게 도구의 핵심이고,
          그래서 차선의 1순위로 삼은 지표가 <strong className="text-foreground">MTTI(Mean Time To Identify)</strong>다.
        </Lead>

        <DiscoveryTimeline
          title="발견 순서 — 'PWA = 환경 통합'이 아니라는 인식"
          steps={[
            {
              num: "Step 1",
              eyebrow: "첫 신호",
              title: "한 환경의 사고가 다른 환경에서 어떻게 일어날지 사전 검토가 비현실적",
              metas: [
                { key: "연결", body: <>Locus에서 추적 불가로 디버깅이 막혔던 경험이 직접 떠올랐다 — Joka는 처음부터 다른 가정 위에 설계돼야 한다는 게 명확해졌다.</> },
              ],
            },
            {
              num: "Step 2",
              eyebrow: "재정의",
              title: "'PWA = 통합 앱'이 아니라 '한 명이 세 환경을 책임지는 구조'",
              metas: [
                { key: "사례", body: <>갤럭시 터치가 iOS에서 안 되거나, iOS Safari가 16px 이하 입력 필드에서 무조건 줌인되는 등 환경별 정책 차이가 끊임없이 나타났다.</> },
              ],
            },
            {
              num: "Step 3",
              eyebrow: "원칙",
              title: "사고 예방이 아니라 빠른 인지·복구가 1순위",
              isFinal: true,
              metas: [
                { key: "이어짐", body: <>이 인식이 4계층 로거(<Inline>expected / business / operational / bug</Inline>) + fingerprint 그룹화 + Whitelist 2단 접근 제어 모두의 직접 동기가 됐다.</> },
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
          기술 맥락
        </p>
        <BulletList
          items={[
            <><strong className="text-foreground">민감 데이터:</strong> 가족 사진·메타데이터는 일반 회원가입 모델보다 엄격한 접근 통제가 필요하다.</>,
            <><strong className="text-foreground">소규모 팀 제약:</strong> 운영·보안·관측성을 동시에 감당해야 하며, 과도한 로깅은 노이즈로 역행한다.</>,
            <><strong className="text-foreground">스택:</strong> pnpm + Turborepo 모노레포, Vite 6 + React 19 + TypeScript. Sentry·TanStack Query·전역 ErrorBoundary는 엔트리에서 이미 연동.</>,
          ]}
        />

        <Callout label="핵심 과제">
          <strong>MTTI를 어떻게 줄일 것인가?</strong>
          {" "}이슈 발생 지점을 즉시 특정할 수 있는 구조를 최우선 가치로 삼는다.
        </Callout>
      </DetailSection>

      {/* ── 02. 고민한 방안 ── */}
      <SectionGap>
        <DetailSection id="s-ideation">
          <SectionDivider number="02" label="고민한 방안" />
          <H2>관측성·접근 제어 각각 2가지 전략을 비교</H2>

          <Lead>
            두 가지 독립적인 문제 — <strong className="text-foreground">관측성 전략</strong>과 <strong className="text-foreground">접근 제어 전략</strong> —
            에 대해 각각 방안을 비교했다. 과도한 설계나 운영 부담 없이, 실질적인 재현 맥락을 확보하는 방향을 탐색했다.
          </Lead>

          <H3>① 관측성 전략</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="B"
                  title="레벨+환경 분리 (Console / Sentry) + Breadcrumbs"
                  pros="재현 맥락 확보, 운영 단계별 노이즈 조절"
                  cons="초기 설계·인프라 비용, 샘플링·마스킹 정책 필요"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="A" title="클라이언트 verbose 로깅" cons="노이즈·PII 유출 위험" stacked />
                  <DiscoveryBlock>
                    Locus에서 처음 Sentry를 도입할 때, 도구 사용 자체에 대한 호기심이 우선이라 정책을 미리 세우지 않고 API 호출 지점마다 console.log와 Sentry 전송을 같이 박았다.
                    성공 로그는 사실 필요 없는데, 그것까지 다 남기다 보니 운영 채널과 인박스가 모두 노이즈로 채워졌다.
                    개발이 한창인 도중에는 로그 정리가 항상 우선순위에서 밀렸고, '필요한 신호가 노이즈에 묻히는' 상태가 누적됐다.
                    Joka는 이 경험에서 출발했다 — verbose 로깅은 빠른 도입처럼 보이지만 시간이 갈수록 더 큰 정리 부채를 만든다는 걸 직접 겪었기에, 처음부터 레이어로 분리해 정책을 코드에 박는 방향으로 갔다.
                  </DiscoveryBlock>
                </>
              }
            />
          </GroupBox>

          <H3>② 접근 제어 전략</H3>
          <GroupBox>
            <SplitLayout
              chosen={
                <ChosenCard
                  letter="D"
                  title="OAuth + Whitelist 2단 접근 제어"
                  pros="미인가 주체를 서버에서 일관 차단"
                  cons="운영자의 Whitelist 관리 절차 필요"
                />
              }
              excluded={
                <>
                  <ExcludedHeading noTopMargin />
                  <ExcludedRow letter="C" title="공개 회원제 + 앱 내 역할만" cons="가족 단위 폐쇄성에 불리" stacked />
                  <DiscoveryBlock>
                    Joka는 가족 단위 폐쇄형 사진 아카이브, 즉 '조카 얼굴'이 들어가는 도메인이다.
                    일반 회원제로 가면 누구나 가입 후 시스템에 들어올 수 있는데, 그 시점에 이미 도메인의 본질(가족만 보는 사진)과 어긋난다.
                    단순히 '오남용 방지'라는 일반론이 아니라, 가족 사진을 다루는 서비스라면 '미인가 주체가 시스템 자체에 진입하지 못하게 한다'가 출발점이 되어야 한다고 봤다.
                    그래서 OAuth + Whitelist 2단으로 가서, 인증을 통과해도 운영자가 등록한 식별자만 데이터에 닿을 수 있게 했다.
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
            B + D 조합 — Locus의 "추적 불가" 경험을 재발 방지 지표로, 비용 대비 신뢰가 필요한 도메인에 맞춘 결정.
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
                회고
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--doc-ink)",
                }}
              >
                expected = console only 결정의 결정타
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
              Locus에서 모든 로그를 Sentry로 보내다 무료 토큰이 정상 흐름 이벤트로 빠르게 소진되는 걸 보면서 명확해졌다.
              정상 흐름은 운영자가 알 필요가 없는데 인박스를 채우고 비용까지 잡아먹었다 —
              그래서 Joka는 처음부터 expected는 console에만, business는 샘플링, operational은 allowlist, bug는 즉시 보고하는 4계층 구조로 분리했다.
            </p>
          </div>
        </DetailSection>
      </SectionGap>

      {/* ── 03. 해결 및 구현 ── */}
      <SectionGap>
        <DetailSection id="s-solution">
          <SectionDivider number="03" label="해결 및 구현" />
          <H2>레이어별 로거와 Sentry 정책으로 추적 가능한 구조를 코드로 고정</H2>

          {/* Observability */}
          <H3>관측성 — 4개 레이어 로거</H3>
          <Lead>
            로거를 4개 레이어(expected · business · operational · bug)로 나누어,
            각 레이어가 Console에만 남길지, 또는 Sentry로도 전송할지를 정책으로 고정한다.
          </Lead>

          <FileTree items={LOGGER_LAYERS} />

          <CodeBlock
            language="typescript"
            filename="shared/lib/logger/index.ts (feat/#38 브랜치)"
            code={`// 레이어별 Console vs Sentry 분기
const log = {
  // 예상된 흐름 — console만, 운영 노이즈 없음
  expected(message: string, context?: LogContext): void {
    console.debug('[expected]', message, context);
  },

  // 비즈니스 이벤트 — BUSINESS_SAMPLE_RATE로 Sentry 보조 전송
  business(message: string, context?: LogContext): void {
    if (Math.random() < BUSINESS_SAMPLE_RATE) {
      sendToSentry('info', 'business', message, context);
    }
  },

  // 운영 경고 — 허용 메시지 화이트리스트만 통과
  operational(message: string, context?: LogContext): void {
    sendToSentry('warning', 'operational', message, context);
  },

  // 버그 — captureException으로 즉시 보고
  bug(error: Error, context?: LogContext): void {
    sendToSentry('error', 'bug', error, context);
  },
};`}
          />

          {/* Sentry policy */}
          <H3>Sentry 노이즈 정책 — beforeSend 필터</H3>
          <Lead>
            <Inline>sentry.policy.ts</Inline>에서
            레이어 태그별로 이벤트를 드롭하거나 샘플링한다. <Inline>operationId + mediaState</Inline> 기반 fingerprint로
            이슈를 그룹화하여 중복 알림을 억제한다.
          </Lead>

          <CodeBlock
            language="typescript"
            filename="shared/lib/monitoring/sentry.policy.ts (feat/#38 브랜치)"
            code={`const applyBeforeSendFilter = (event: SentryEvent): SentryEvent | null => {
  const layer = event.tags?.layer;

  // expected → 전면 드롭
  if (layer === 'expected') return null;

  // business → 이중 샘플링
  if (layer === 'business' && Math.random() > BUSINESS_SAMPLE_RATE) return null;

  // operational → 허용 메시지 화이트리스트 필터
  if (layer === 'operational') {
    const allowed = OPERATIONAL_ALLOWLIST.includes(event.message ?? '');
    if (!allowed) return null;
  }

  // operationId + mediaState 기반 fingerprint로 이슈 그룹화
  if (event.extra?.operationId && event.extra?.mediaState) {
    event.fingerprint = [
      'joka',
      String(event.extra.operationId),
      String(event.extra.mediaState),
    ];
  }

  return event;
};`}
          />

          {/* Security */}
          <H3>보안 — OAuth + Whitelist 2단 접근 제어</H3>
          <Lead>
            OAuth 인증을 통과한 이후에도, 서버 측 Whitelist에 등록된 식별자만 데이터에 접근할 수 있도록
            설계했다. 인가 레이어를 애플리케이션이 아닌 서버 정책으로 고정해, 미인가 주체가
            API에 도달하기 전 차단되는 구조를 목표로 한다 (Whitelist 인가 미들웨어 도입 진행 중).
          </Lead>

          <Callout>
            요청 → OAuth 인증 → Whitelist 확인 → 데이터 접근 허용
            <br />
            <span style={{ fontSize: "0.88rem", color: "rgba(20,15,40,0.55)" }}>
              Whitelist 미포함 식별자는 서버에서 일관 차단되도록 설계 (서버 측 미들웨어 도입 진행 중).
            </span>
          </Callout>

          {/* Architecture */}
          <H3>프론트엔드 구조 — Feature-Sliced Design</H3>
          <Lead>
            <Inline>apps/web/src</Inline> 아래를
            FSD(Feature-Sliced Design)에 가깝게 레이어링했다. 엔트리에서는 <Inline>QueryClientProvider</Inline> +
            <Inline> ErrorBoundary</Inline>를 기준으로 정리한다.
          </Lead>

          <FileTree rootItem={FSD_ROOT} items={FSD_LAYERS} />
        </DetailSection>
      </SectionGap>

      {/* ── 04. 결과 ── */}
      <SectionGap>
        <DetailSection id="s-result" isLast>
          <SectionDivider number="04" label="결과" />
          <H2>이전 프로젝트의 시행착오를 팀 표준으로 승격</H2>

          <Lead>
            Sentry <Inline>beforeSend</Inline> 필터·레이어 태그·fingerprint·전역 ErrorBoundary가 코드로 고정되어,
            이슈 발생 지점을 즉시 특정하고 재현 맥락을 바로 열람할 수 있는 구조가 마련됐다.
          </Lead>

          <CategoryBlock num="01" name="개발 환경 작동 관찰" sub="아직 운영 전 — 정량 지표는 보강 예정">
            <CategorySingle
              title="동일 에러를 반복 발생시켜도 fingerprint로 자동 그룹화 — 인박스에 같은 이벤트가 쌓이지 않는다"
              body={<>operational 5분 쿨다운으로 같은 메시지 도배도 사라졌다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="02" name="디버깅 흐름 변화" sub="joka_standard + n8n + Gemini 자동 분석">
            <CategorySingle
              title="이슈 도착 → 사람이 처음부터 분석'이 '자동 요약 → 필요한 부분만 deep dive'로 바뀌었다"
              body={<>stack trace를 처음부터 추적하던 디버깅 시작 지점이 한 단계 뒤로 이동했다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="03" name="정직한 회고" sub="팀 표준 승격은 미래 단계">
            <CategorySingle
              title="현 시점에서 '팀 표준'으로 승격됐다고 말하긴 어렵다"
              body={<>운영 단계도 아니고, 다른 프로젝트 이식 사례도 없다. 외부적 표준화는 운영 데이터가 쌓이면서 검증되어야 할 다음 단계.</>}
            />
          </CategoryBlock>

          <CategoryBlock num="04" name="학습 사이클" sub="Locus → Joka 직접 동기">
            <CategorySingle
              title="이전 시행착오에서 배운 것을 다음 프로젝트의 설계 원칙으로 승격시킨 사례"
              body={<>Locus의 '추적 불가' 디버깅·무료 토큰 노이즈 소진 경험이 4계층 로거 + Whitelist 2단 결정의 직접 동기가 됐다.</>}
            />
          </CategoryBlock>

          <H3>현재 main 머지 상태</H3>
          <LimitationGrid>
            <LimitationCard item="관측성 (웹 클라이언트)" status="feat/#38 브랜치 구현 완료, main 머지 진행" note="4계층 로거 · Sentry 정책 · ErrorBoundary 코드 작성됨" />
            <LimitationCard item="FSD 레이어 구조 / 모노레포" status="main 반영" note="—" />
            <LimitationCard item="Whitelist · 서버 인가" status="진행중" note="현재 서버는 tester Actor 주입 단계" />
            <LimitationCard item="PWA 빌드 설정 (vite-plugin-pwa)" status="진행중" note="vite.config.ts 미적용" />
          </LimitationGrid>

          <DetailFurtherReading items={FURTHER_READING} />
        </DetailSection>
      </SectionGap>
    </DetailLayout>
  );
}
