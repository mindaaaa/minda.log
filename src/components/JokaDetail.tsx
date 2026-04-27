import React from "react";

import { DetailFurtherReading, FurtherReadingItem } from "@/components/detail/DetailFurtherReading";
import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import {
  Lead, H2, H3, BulletList, SectionDivider, Callout, Inline,
  DetailTable, CodeBlock,
} from "@/components/detail/DetailPrimitives";
import { OptionCard, OptionCardGrid, AchievementCard, AchievementGrid, LimitationCard, LimitationGrid, LayerCard, LayerStack, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
import { Github, Figma } from "lucide-react";

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
        single: { src: "", caption: "가족 사진 타임라인 흐름" },
      }}
      onBack={onBack}
    >
      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="s-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>"누가, 어느 환경에서, 무엇을 했는지" 추적 불가의 공백</H2>

        <Lead>
          Joka는 가족 단위 폐쇄형 사진 아카이브 PWA다. PWA 특성상 OS·브라우저·설치 모드 조합이 달라
          동일 코드도 재현하기 어려운 런타임 이슈가 발생하기 쉽고, 가족 사진·메타데이터라는 민감한
          데이터를 다루는 만큼 접근 제어가 무엇보다 중요했다.
        </Lead>

        <BulletList
          items={[
            <><strong className="text-foreground">PWA 런타임 이슈:</strong> OS·브라우저·설치 모드 조합에 따른 재현 불가 문제 — MTTI가 길어진다.</>,
            <><strong className="text-foreground">민감 데이터:</strong> 가족 사진·메타데이터는 일반 회원가입 모델보다 엄격한 접근 통제가 필요하다.</>,
            <><strong className="text-foreground">소규모 팀 제약:</strong> 운영·보안·관측성을 동시에 감당해야 하며, 과도한 로깅은 노이즈로 역행한다.</>,
            <><strong className="text-foreground">기술 맥락:</strong> pnpm 워크스페이스 + Turborepo 모노레포, Vite 6 + React 19 + TypeScript. Sentry·TanStack Query·전역 ErrorBoundary는 엔트리에서 이미 연동.</>,
          ]}
        />

        <Callout label="핵심 과제">
          <strong>MTTI(Mean Time To Identify)를 어떻게 줄일 것인가?</strong>
          <br />
          이슈 발생 지점을 즉시 특정할 수 있는 구조를 최우선 가치로 삼는다.
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

          <H3>관측성 전략</H3>
          <OptionCardGrid>
            <OptionCard letter="A" title="클라이언트 verbose 로깅" pros="빠르게 도입 가능" cons="서버·기기 컨텍스트 결합 어렵고, 노이즈·PII 유출 위험" />
            <OptionCard letter="B" title="레벨+환경 분리 (Console / Sentry) + Breadcrumbs" pros="재현 맥락 확보, 운영 단계별 노이즈 조절" cons="초기 설계·인프라 비용, 샘플링·마스킹 정책 필요" chosen />
          </OptionCardGrid>

          <H3>접근 제어 전략</H3>
          <OptionCardGrid>
            <OptionCard letter="C" title="공개 회원제 + 앱 내 역할만" pros="구현 단순" cons="가족 단위 폐쇄성·오남용 방지에 불리" />
            <OptionCard letter="D" title="OAuth + Whitelist 2단 접근 제어" pros="미인가 주체를 서버에서 일관 차단" cons="운영자의 Whitelist 관리 절차 필요" chosen />
          </OptionCardGrid>

          <Callout label="최종 선택: B + D">
            Locus 프로젝트에서 겪은 "추적 불가" 문제를 재발 방지 지표로 삼아,
            비용 대비 신뢰가 필요한 도메인에 맞게 두 방안을 조합했다.
          </Callout>
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

          <LayerStack>
            <LayerCard name="log.expected" color="#10b981" target="Console only" description="예상된 흐름 — 운영 노이즈 없음" />
            <LayerCard name="log.business" color="#3b82f6" target="Console + Sentry(info, 샘플링)" description="비즈니스 이벤트 — BUSINESS_SAMPLE_RATE 기준 보조 전송" />
            <LayerCard name="log.operational" color="#f59e0b" target="Sentry(warning, allowlist)" description="허용 메시지 Allowlist 통과 시에만 전송" />
            <LayerCard name="log.bug" color="#ef4444" target="Sentry(error, captureException)" description="미처리 예외·ErrorBoundary → 즉시 보고" />
          </LayerStack>

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

          <LayerStack>
            <LayerCard name="app/" color="#7c6ff7" target="엔트리" description="프로바이더·스타일 — QueryClientProvider, ErrorBoundary, 라우터" />
            <LayerCard name="entities/" color="#6366f1" target="도메인 모델" description="도메인 모델 단위 (Media, User 등)" />
            <LayerCard name="features/" color="#8b5cf6" target="인터랙션" description="사용자 인터랙션 단위 슬라이스" />
            <LayerCard name="pages/" color="#a78bfa" target="라우트" description="라우트에 대응하는 페이지 컴포넌트" />
            <LayerCard name="widgets/" color="#c4b5fd" target="복합 UI" description="재사용 가능한 복합 UI 블록" />
            <LayerCard name="shared/" color="#9ca3af" target="공통 유틸" description="logger, sentry, QueryClient 등 공통 유틸" />
          </LayerStack>
        </DetailSection>
      </SectionGap>

      {/* ── 04. 결과 ── */}
      <SectionGap>
        <DetailSection id="s-result" isLast>
          <SectionDivider number="04" label="결과" />
          <H2>이전 프로젝트의 시행착오를 팀 표준으로 승격</H2>

          <Lead>
            Sentry <Inline>beforeSend</Inline> 필터·레이어 태그·fingerprint·전역 ErrorBoundary가 코드로 고정되어,
            이슈 발생 시 발생 지점을 즉시 특정하고 재현 맥락을 바로 열람할 수 있는 구조가 마련됐다.
            Locus에서 "추적 불가"로 고생했던 경험이 이 프로젝트의 설계 원칙이 됐다.
          </Lead>

          <AchievementGrid>
            <AchievementCard title="MTTI 단축" description="operationId + mediaState 기반 fingerprint로 이슈를 자동 그룹화, 중복 알림 없이 발생 지점 특정이 가능해졌다." />
            <AchievementCard title="운영 노이즈 감소" description="레이어별 드롭·샘플링 정책으로 Sentry 이벤트가 의미 있는 것만 남는다." />
            <AchievementCard title="접근 통제" description="OAuth + Whitelist 2단 구조로 미인가 주체는 서버에서 차단 — 애플리케이션 로직에 도달하지 않는다." />
            <AchievementCard title="실측 수치" description="MTTI 정량 지표는 프로덕션 관측 후 보강 예정." />
          </AchievementGrid>

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
