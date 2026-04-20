import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import {
  Lead, H2, H3, BulletList, SectionDivider, Callout, Inline,
  DetailTable,
} from "@/components/detail/DetailPrimitives";
import {
  OptionCard, OptionCardGrid, AchievementCard, AchievementGrid,
  LimitationCard, LimitationGrid, LayerCard, LayerStack,
  StackChip, StackRow, DocMeta,
} from "@/components/detail/DetailCards";
import { CommandFlow, CommandTriggers } from "@/components/detail/CommandFlow";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
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
        single: { src: "", caption: "코드 실행 → AI 분류·해설 → 단계별 시각화" },
      }}
      onBack={onBack}
    >
      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="s-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>AI가 조용히 계약을 깬다 — 팀이 같은 Claude를 쓸 때의 리스크</H2>

        <Lead>
          Frogger는 브라우저에서 Python/JS/Java를 실행하면 AI가 알고리즘을 분류하고 실행 흐름을
          단계별 시각화 + 자연어 해설로 변환하는 3단 파이프라인 제품이다. 바이브코딩 대회 4인
          출전작으로, 팀원 작업 범위가 서로 맞물려 있어 한 명이 프롬프트를 살짝 바꾸면 다른
          사람의 렌더러가 조용히 깨지는 구조적 리스크가 상수였다.
        </Lead>

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

          <H3>컨텍스트 전달 전략</H3>
          <OptionCardGrid>
            <OptionCard
              letter="A"
              title="루트 단일 CLAUDE.md"
              pros="파일 하나로 관리 단순"
              cons="토큰 비대화 — 레이어 규칙이 서로 간섭, AI가 '지금 이 레이어의 금지'를 흐릿하게 인식"
            />
            <OptionCard
              letter="B"
              title="계층형 CLAUDE.md (루트 + 4 레이어)"
              pros="작업 레이어의 강제 규칙만 자동 로드, 코드와 함께 이동"
              cons="문서 신선도 관리 비용 — 설계 변경 시 md도 같이 움직여야 함"
              chosen
            />
          </OptionCardGrid>

          <H3>검증 집행 전략</H3>
          <OptionCardGrid>
            <OptionCard
              letter="C"
              title="런타임 Zod 검증만"
              pros="스키마 자체는 보장됨"
              cons="AI 응답이 오기 전까지 에러를 만나지 못함 — 대회 일정에서 사이클 낭비"
            />
            <OptionCard
              letter="D"
              title="슬래시 커맨드 기반 정적 검증 + Store 강제"
              pros="런타임 이전에 계약 불일치 차단, 수동 병합 경로가 타입상 존재하지 않음"
              cons="커맨드는 사람이 호출해야 함 — 팀 스케일에서 호출 공백 위험"
              chosen
            />
          </OptionCardGrid>

          <Callout label="최종 선택: B + D">
            두 축을 조합해 "까먹을 수 없는 것(계층형 md)"과 "의도적으로 호출하는 것(슬래시 커맨드)"을
            명확히 분리. 커맨드 공백 리스크는 §04의 회고 지점으로 의식적으로 남겨 두었다.
          </Callout>
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

          <LayerStack>
            <LayerCard
              name="루트 CLAUDE.md"
              color="#7c6ff7"
              target="전역 철학"
              description="실행 ↔ AI ↔ 렌더 3축 분리, 타입 안전성 원칙"
            />
            <LayerCard
              name="app/api/analyze"
              color="#f59e0b"
              target="AI 분류 레이어"
              description="타입·이름이 아니라 '사용 패턴'만으로 알고리즘 분류"
            />
            <LayerCard
              name="src/features/execution"
              color="#10b981"
              target="Worker 레이어"
              description="Worker 통신은 ProvaRuntime 클래스 경유, 직접 postMessage 금지"
            />
            <LayerCard
              name="src/features/trace"
              color="#3b82f6"
              target="Store 레이어"
              description="mergeTrace() 자동 호출, 수동 병합 금지 / 길이 불일치는 EMPTY_ANNOTATED 패딩"
            />
            <LayerCard
              name="src/features/visualization"
              color="#ec4899"
              target="Renderer 레이어"
              description="렌더러는 action만 받고, 색상·스타일은 AI가 결정하지 않는다"
            />
          </LayerStack>

          {/* (b) 슬래시 커맨드 */}
          <H3>슬래시 커맨드 — AI 프롬프트 변경을 "타입 시스템의 이벤트"로</H3>
          <Lead>
            8개 슬래시 커맨드로 일상 워크플로우와 변경 파일 유형별 전용 검증을 분리했다.
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
              { trigger: "타입 · 인터페이스", command: "/refactor-audit" },
              { trigger: "AI 프롬프트",       command: "/prompt-diff",  highlight: true },
              { trigger: "Worker · Trace",   command: "/trace-validate", highlight: true },
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

          <H3>대회 기간 중 얻은 것</H3>
          <AchievementGrid>
            <AchievementCard
              title="레이어 계약으로 AI 생성 품질 안정화"
              description="CLAUDE.md를 '설정'이 아니라 '레이어 계약'으로 다뤄, 같은 맥락 재주입 없이도 레이어별 생성 품질이 일관됐다."
            />
            <AchievementCard
              title="계약 위반을 타입 레벨로 조기 차단"
              description="/prompt-diff · /trace-validate · /pr-ready 로 AI 응답 스키마 불일치 · 트레이스 길이 어긋남이 런타임 이전에 걸린다."
            />
            <AchievementCard
              title="의사결정 로그로 같은 PR 반복 제거"
              description="채택 2개 · 미채택 3개를 같은 문서에 박제해, 몇 주 뒤 같은 최적화 시도를 재검토하는 비용을 없앴다."
            />
            <AchievementCard
              title="3축 파이프라인 역할 분리 유지"
              description="실행 ↔ AI ↔ 렌더 세 축이 서로 침범하지 않도록 경계를 CLAUDE.md + Store 강제로 이중 고정."
            />
          </AchievementGrid>

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
