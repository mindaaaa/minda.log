import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import { Lead, H2, H3, BulletList, SectionDivider, Callout, Inline, DetailTable, CodeBlock } from "@/components/detail/DetailPrimitives";
import { LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
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
import { Github, BookOpen } from "lucide-react";
import { DetailFurtherReading, FurtherReadingItem } from "@/components/detail/DetailFurtherReading";

const ACCENT = "#10b981";

// ─── Further Reading data ────────────────────────────────────────────────────

const FURTHER_READING: FurtherReadingItem[] = [
  {
    type: "Wiki",
    title: "Git Internals – Git 내부 구조와 핵심 객체 이해",
    description: "blob · tree · commit 해시 체이닝 원리",
    href: "https://github.com/mindaaaa/Dev-Journey/blob/main/CS/mini-git/git-internals.md",
  },
  {
    type: "Blog",
    title: "Git 구현 기반 학습 회고",
    description: "직접 구현하며 배운 Git 내부 동작 원리",
    href: "https://github.com/mindaaaa/Dev-Journey/blob/main/CS/mini-git/mini-git-summary.md",
  },
  {
    type: "ADR",
    title: "Git 구조 단순화 설계 노트",
    description: "학습용 미니 Git 아키텍처 결정 과정",
    href: "https://github.com/mindaaaa/Dev-Journey/blob/main/CS/mini-git/git-design-notes.md",
  },
  {
    type: "Wiki",
    title: "Git 내부 구조 비교 실험",
    description: "실제 Git과 mini-git의 객체 저장 동작 비교",
    href: "https://github.com/mindaaaa/Dev-Journey/blob/main/CS/mini-git/git-behavior-comparison.md",
  },
];

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: "mini-git-context",   label: "상황 및 문제" },
  { id: "mini-git-ideation",  label: "고민한 방안" },
  { id: "mini-git-solution",  label: "해결 및 구현" },
  { id: "mini-git-result",    label: "결과" },
] as const;

// ─── Light theme constants ───────────────────────────────────────────────────

const DIAGRAM_BG = "rgba(155, 142, 196, 0.04)";
const DIAGRAM_BORDER = "rgba(155, 142, 196, 0.18)";
const ACCENT_LABEL = "#9B8EC4";
const ACCENT_LABEL_ALT = "#7B6FA6";
const LAVENDER_BORDER = "rgba(155,142,196,0.25)";

// ─── Architecture Diagrams ─────────────────────────────────────────────────────

function GitObjectModelDiagram() {
  return (
    <div style={{ borderRadius: "14px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: ACCENT_LABEL, marginBottom: "18px" }}>
        아키텍처 — Git 객체 모델 (3계층)
      </p>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* blob */}
        <div style={{ flex: 1, minWidth: "140px" }}>
          <ObjectCard
            type="blob"
            color="#10b981"
            badge="파일 내용"
            fields={[
              { label: "헤더", value: 'blob 23\\0' },
              { label: "본문", value: "파일 내용 raw bytes" },
              { label: "해시", value: "SHA-1(헤더+본문)" },
              { label: "경로", value: "objects/ab/cde..." },
            ]}
            note="파일 이름·경로 없음"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", paddingTop: "40px" }}>
          <ChainArrow />
        </div>

        {/* tree */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <ObjectCard
            type="tree"
            color="#0ea5e9"
            badge="디렉터리 스냅샷"
            fields={[
              { label: "엔트리", value: "100644 README.md\\0" },
              { label: "", value: "  + 20바이트 blob 해시" },
              { label: "반복", value: "파일마다 엔트리 반복" },
            ]}
            note="이름·권한 모드는 여기에만"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", paddingTop: "40px" }}>
          <ChainArrow />
        </div>

        {/* commit */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <ObjectCard
            type="commit"
            color="#a855f7"
            badge="스냅샷 포인터"
            fields={[
              { label: "tree", value: "루트 tree 해시" },
              { label: "parent", value: "이전 commit 해시 (있으면)" },
              { label: "author", value: "작성자 + 시각" },
              { label: "message", value: "커밋 메시지" },
            ]}
            note="diff가 아닌 트리 전체 포인터"
          />
        </div>
      </div>

      {/* Immutability callout */}
      <div style={{ marginTop: "14px", borderTop: `1px solid ${LAVENDER_BORDER}`, paddingTop: "12px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, background: "rgba(155,142,196,0.06)", border: `1px solid ${LAVENDER_BORDER}`, borderRadius: "8px", padding: "9px 12px", minWidth: "180px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: ACCENT_LABEL, marginBottom: "3px" }}>불변(Immutable)</p>
          <p style={{ fontSize: "0.73rem", color: "rgba(20,18,40,0.6)", margin: 0, lineHeight: 1.55 }}>blob · tree · commit 객체는 한 번 쓰면 덮어쓰지 않음 — 내용이 같으면 항상 같은 해시</p>
        </div>
        <div style={{ flex: 1, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.14)", borderRadius: "8px", padding: "9px 12px", minWidth: "180px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#dc2626", marginBottom: "3px" }}>가변(Mutable)</p>
          <p style={{ fontSize: "0.73rem", color: "rgba(20,18,40,0.6)", margin: 0, lineHeight: 1.55 }}>브랜치 ref 파일만 새 commit 해시로 덮어씀 — "어디를 가리키는지"만 바뀜</p>
        </div>
      </div>
    </div>
  );
}

function ObjectCard({ type, color, badge, fields, note }: {
  type: string; color: string; badge: string;
  fields: { label: string; value: string }[];
  note: string;
}) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${LAVENDER_BORDER}`, borderTop: `3px solid ${color}`, borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ background: "rgba(0,0,0,0.02)", padding: "8px 12px", borderBottom: `1px solid ${LAVENDER_BORDER}` }}>
        <code style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color }}>{type}</code>
        <span style={{ marginLeft: "8px", fontSize: "0.65rem", color: "rgba(20,18,40,0.45)" }}>{badge}</span>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {fields.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "3px" }}>
            {f.label && <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(20,18,40,0.35)", minWidth: "40px", paddingTop: "1px" }}>{f.label}</span>}
            <code style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#1a1a2e", lineHeight: 1.5 }}>{f.value}</code>
          </div>
        ))}
        <p style={{ marginTop: "6px", fontSize: "0.66rem", color: `${color}cc`, fontStyle: "italic", margin: "6px 0 0" }}>{note}</p>
      </div>
    </div>
  );
}

function ChainArrow() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path d="M0 8h18M12 2l8 6-8 6" stroke={LAVENDER_BORDER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContentAddressableDiagram() {
  return (
    <div style={{ borderRadius: "14px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: ACCENT_LABEL, marginBottom: "18px" }}>
        아키텍처 — Content-Addressable 저장 흐름
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {/* Step 1 */}
        <FlowStep bg="#fff" border="rgba(0,0,0,0.08)">
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(20,18,40,0.4)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.1em" }}>입력</p>
              <code style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#1a1a2e" }}>type="blob"  content="Hello, world!"</code>
            </div>
          </div>
        </FlowStep>
        <FlowArrow />

        {/* Step 2 */}
        <FlowStep bg="rgba(155,142,196,0.06)" border={LAVENDER_BORDER}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: ACCENT_LABEL, marginBottom: "5px" }}>헤더 + 본문 조합</p>
          <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "#1a1a2e" }}>
            store = <span style={{ color: ACCENT_LABEL }}>"blob 13\0"</span> + <span style={{ color: "#0ea5e9" }}>"Hello, world!"</span>
          </code>
          <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.45)", marginTop: "3px" }}>타입 + 공백 + 바이트 길이 + NUL 문자 + 본문</p>
        </FlowStep>
        <FlowArrow />

        {/* Step 3 */}
        <FlowStep bg="rgba(168,85,247,0.04)" border="rgba(168,85,247,0.15)">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7c3aed", marginBottom: "5px" }}>SHA-1 해시 계산</p>
          <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "#1a1a2e" }}>
            hash = SHA-1(store) = <span style={{ color: "#7c3aed" }}>8ab686eafeb1f44702738c8b0f24f2567c36da6d</span>
          </code>
          <p style={{ fontSize: "0.7rem", color: "rgba(20,18,40,0.45)", marginTop: "3px" }}>동일 내용 → 항상 동일 해시 (중복 저장 자연 억제)</p>
        </FlowStep>
        <FlowArrow />

        {/* Step 4 */}
        <FlowStep bg="#fff" border="rgba(0,0,0,0.08)">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "5px" }}>loose object 레이아웃으로 저장</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.65rem", color: "rgba(20,18,40,0.4)", marginBottom: "3px" }}>디렉터리</p>
              <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: ACCENT_LABEL_ALT }}>.mini-git/objects/8a/</code>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", color: "rgba(20,18,40,0.4)", marginBottom: "3px" }}>파일명</p>
              <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: ACCENT_LABEL_ALT }}>b686eafeb1f44702738c8b0f24f2567c36da6d</code>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", color: "rgba(20,18,40,0.4)", marginBottom: "3px" }}>내용</p>
              <code style={{ fontFamily: "monospace", fontSize: "0.76rem", color: "rgba(20,18,40,0.55)" }}>zlib.deflateSync(store)</code>
            </div>
          </div>
        </FlowStep>
      </div>
    </div>
  );
}

function FlowStep({ bg, border, children }: { bg: string; border: string; children: React.ReactNode }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px", padding: "12px 16px", margin: "0 16px" }}>
      {children}
    </div>
  );
}

function FlowArrow() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "3px 0" }}>
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
        <path d="M8 0v14M2 8l6 8 6-8" stroke={LAVENDER_BORDER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function StrategyPatternDiagram() {
  return (
    <div style={{ borderRadius: "14px", border: `1px solid ${DIAGRAM_BORDER}`, background: DIAGRAM_BG, padding: "20px 24px", marginBottom: "1.75rem" }}>
      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: ACCENT_LABEL, marginBottom: "18px" }}>
        아키텍처 — 전략 패턴 명령 디스패치
      </p>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left: entry point */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>진입점 (index.js)</div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "10px", padding: "10px 14px" }}>
            <code style={{ fontFamily: "monospace", fontSize: "0.73rem", color: "#1a1a2e", lineHeight: 1.65 }}>
              const cmd = args[0]<br />
              const strategy =<br />
              &nbsp;CommandStrategy[cmd]<br /><br />
              <span style={{ color: "#ef4444" }}>if (!strategy) exit(1)</span><br />
              <span style={{ color: ACCENT_LABEL_ALT }}>strategy.run(args, gitDir)</span>
            </code>
          </div>
          <div style={{ marginTop: "6px", fontSize: "0.68rem", color: ACCENT_LABEL_ALT, fontWeight: 500 }}>
            진입점 고정 — 명령 추가 시 수정 없음
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", paddingTop: "36px" }}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M0 8h18M12 2l8 6-8 6" stroke={LAVENDER_BORDER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right: strategy map */}
        <div style={{ flex: 1.2, minWidth: "180px" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(20,18,40,0.35)", marginBottom: "8px" }}>CommandStrategy 맵</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {[
              { cmd: "init",     mod: "commands/init.js" },
              { cmd: "add",      mod: "commands/add.js" },
              { cmd: "commit",   mod: "commands/commit.js" },
              { cmd: "log",      mod: "commands/log.js" },
              { cmd: "cat-file", mod: "commands/catFile.js" },
            ].map(({ cmd, mod }) => (
              <div key={cmd} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: `1px solid ${LAVENDER_BORDER}`, borderRadius: "7px", padding: "6px 12px" }}>
                <code style={{ fontFamily: "monospace", fontSize: "0.73rem", fontWeight: 700, color: ACCENT_LABEL_ALT, minWidth: "60px" }}>"{cmd}"</code>
                <span style={{ fontSize: "0.64rem", color: "rgba(20,18,40,0.3)" }}>→</span>
                <code style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(20,18,40,0.55)" }}>{mod}</code>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "6px", fontSize: "0.68rem", color: "rgba(20,18,40,0.4)" }}>
            새 명령 = 맵 항목 추가만으로 확장
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
        mini-git
      </h1>
      <p style={{ fontSize: HERO_SUB_SIZE, color: "var(--doc-ink-2)", fontWeight: 400, lineHeight: 1.55, margin: "0 0 32px", maxWidth: 640 }}>
        Git 학습용 CLI — 콘텐츠 주소 저장소의 원리를 최소 코드로 체득하다.
      </p>
      <DocMeta items={[
        { key: "역할", value: "개인 학습 프로젝트" },
        { key: "기간", value: "2025.05 — 2025.06 (코어), 2026.04 (web playground)" },
        { key: "스택", value: (
          <StackRow>
            {["Node.js", "JavaScript", "SHA-1", "zlib", "Content-Addressable", "CLI"].map((t) => (
              <StackChip key={t} label={t} />
            ))}
          </StackRow>
        )},
      ]} />
      <ActionRow>
        <DetailActionButton variant="primary" icon={<Github size={15} />} label="GitHub" href="https://github.com/mindaaaa/mini-git" />
        <DetailActionButton variant="ghost" icon={<BookOpen size={15} />} label="Docs" href="https://github.com/mindaaaa/Dev-Journey/tree/main/CS/mini-git" />
      </ActionRow>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MiniGitDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName="mini-git"
      toc={TOC}
      tocClassName="mini-git-toc"
      heroContent={<HeroContent />}
      heroVideo={{
        layout: "inline-landscape",
        projectName: "mini-git",
        single: {
          src: "/videos/mini-git/demo.webm",
          srcFallback: "/videos/mini-git/demo.mp4",
        },
      }}
      onBack={onBack}
      accent="#10b981"
    >

      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id="mini-git-context">
        <SectionDivider number="01" label="상황 및 문제" />
        <H2>Git을 명령어로만 외우면 "왜"를 놓친다</H2>

        <Lead>
          Git은 겉으로는 버전 관리 도구지만, 내부는 <strong>콘텐츠 주소 지정 저장소(content-addressable store)</strong>다.
          문서만 읽으면 "커밋 = 변경 요약"으로 오해하기 쉬운데, 실제 커밋 객체는 루트 tree 해시와 parent 커밋 해시를 담은 포인터다.
          mini-git은 이 세 층(객체 / ref / index)을 최소 형태로 직접 구현해 <strong className="text-foreground">'불변 객체 + 가변 포인터'</strong> 분리를 체득하기 위한 프로젝트다.
        </Lead>

        <DiscoveryTimeline
          title="발견 순서 — 폴더 구조 오해에서 학습 경계까지"
          steps={[
            {
              num: "Step 1",
              eyebrow: "가장 큰 오해",
              title: "git이 폴더 구조를 계층적으로 저장한다고 막연히 추정했다",
              metas: [
                { key: "발견", body: <>실제로는 모든 게 해시로 평면 저장되고, tree 객체가 디렉터리 구조의 '의미'만 담는다 — 폴더 안에 폴더가 복제되거나 diff로 저장되는 게 아니다.</> },
              ],
            },
            {
              num: "Step 2",
              eyebrow: "풀린 미스터리",
              title: "commit 객체 안의 parent 해시 한 줄로 조상·브랜치가 끝난다",
              metas: [
                { key: "인상", body: <>단순한 개념으로 이렇게 강력한 동작이 만들어진다는 게 인상적이었다.</> },
              ],
            },
            {
              num: "Step 3",
              eyebrow: "학습 경계",
              title: "머지까지 가려다 'blob/tree/commit으로 충분'이 명확해졌다",
              isFinal: true,
              metas: [
                { key: "이어짐", body: <>이 '불변 객체 + 가변 포인터' 패턴이 다음 프로젝트(Joka의 append-only 로그 + beforeSend 가변 해석)에서 비슷한 형태로 다시 나타났다 — 일반화 가능한 패턴인지는 더 학습 필요.</> },
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
          학습 범위 결정 4축
        </p>
        <BulletList items={[
          <><strong className="text-foreground">CLI 구조:</strong> 명령이 늘수록 진입점 <Inline>if/else</Inline>가 비대해지면 OCP가 깨진다 — 전략 맵으로 진입점 고정.</>,
          <><strong className="text-foreground">모델 오해:</strong> "커밋 = 변경 요약"으로 오해하기 쉽지만, 실제로는 루트 tree 해시 + parent 해시가 커밋에 들어간다.</>,
          <><strong className="text-foreground">데이터 무결성:</strong> 객체 저장소를 append-only로 두고 상태 전이를 "새 객체 + ref 이동"으로만 표현하면 역사가 불변 체인으로 남는다.</>,
          <><strong className="text-foreground">학습 범위:</strong> packfile, merge, index v2 바이너리는 의도적으로 생략 — loose object + zlib 수준에서 원리를 담보.</>,
        ]} />

        <Callout label="핵심 질문">
          <strong>Git의 세 층(객체·ref·index)을 최소한의 코드로 직접 구현해 "무엇이 불변이고 무엇이 가변인지"를 체득할 수 있는가?</strong>
        </Callout>
      </DetailSection>

      <SectionGap>

      {/* ── 02. 고민한 방안 ── */}
      <DetailSection id="mini-git-ideation">
        <SectionDivider number="02" label="고민한 방안" />
        <H2>명령 디스패치와 저장소 표현, 두 축의 트레이드오프</H2>

        <Lead>
          CLI 진입점 설계와 저장소 표현 방식 두 축에서 각각 방안을 비교했다.
          학습 목적에 충실하면서도 실제 Git의 원리를 최대한 그대로 담는 방향을 기준으로 결정했다.
        </Lead>

        <H3>① 명령 디스패치 전략</H3>
        <GroupBox>
          <SplitLayout
            chosen={
              <ChosenCard
                letter="B"
                title="전략 맵 + run(args, gitDir)"
                pros="명령별 모듈 분리, 진입점 단일화"
                cons="맵 등록 누락 시 런타임 에러 (규약·리뷰로 보완)"
              />
            }
            excluded={
              <>
                <ExcludedHeading noTopMargin />
                <ExcludedRow letter="A" title="거대 switch/if" cons="OCP 위반" stacked />
                <ExcludedRow letter="C" title="플러그인 로더" cons="학습·디버깅 난이도 상승" stacked />
                <DiscoveryBlock>
                  플러그인 로더(C)는 진지하게 검토한 적이 없다 — 1인 학습 프로젝트라 외부 확장 시나리오 자체가 없었고, 본문엔 디스패치 패턴 비교의 완결성을 위해 일반론으로 함께 나열했다.
                  학습 목적상 '어떤 명령이 등록됐는지 코드에 정적으로 보이는' 전략 맵 방식이 자연스러운 선택이었다.
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
          B 채택 — 전략 맵(<Inline>CommandStrategy</Inline>)으로 진입점을 고정, 새 명령은 맵 항목 추가만으로. 등록 누락은 가드 분기로 조기 종료.
        </p>

        <H3>② 저장소 표현 방식 (진짜 Git과의 거리)</H3>
        <GroupBox>
          <SplitLayout
            chosen={
              <ChosenCard
                letter="B"
                title="loose object + 'type size\\0' 헤더 + SHA-1 + zlib"
                pros="동일 내용 = 동일 해시(중복 방지), cat-file 사고방식 그대로"
                cons="packfile 압축·GC는 미구현"
              />
            }
            excluded={
              <>
                <ExcludedHeading noTopMargin />
                <ExcludedRow letter="A" title="파일 복사 스냅샷만" cons="중복 저장, dedup·무결성 어려움" stacked />
                <ExcludedRow letter="C" title="실제 Git index 바이너리" cons="학습 목적 흐려짐" stacked />
                <DiscoveryBlock>
                  학습 도구의 핵심 가치는 '내부 동작을 눈으로 확인할 수 있는 것'인데, index v2 같은 바이너리 포맷은 IDE에서 열어도 의미가 보이지 않는다 → 동작 의미(스테이징이 별도 레이어다)는 유지하되 저장 형태는 JSON으로 단순화.
                  학습 경계의 기준은 '객체가 어떻게 움직이는지를 직접 추적할 수 있는가'로, packfile · merge · index v2는 그 다음 영역(성능 / 병합 / 포맷 최적화)이라 의도적으로 경계 밖에 두었다.
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
          B 채택 + 스테이징은 JSON index로 단순화 — '스테이징이 별도 레이어'라는 사실만 유지하고, 바이너리 포맷 구현은 학습 핵심을 흐리므로 생략했다.
        </p>
      </DetailSection>
      </SectionGap>

      <SectionGap>

      {/* ── 03. 해결 및 구현 ── */}
      <DetailSection id="mini-git-solution">
        <SectionDivider number="03" label="해결 및 구현" />
        <H2>Git 3계층을 코드로 재현</H2>

        {/* Git Object Model */}
        <H3>Git 객체 모델 — 3계층 이해</H3>
        <Lead>
          mini-git의 핵심은 세 객체 타입의 역할 분리다. <strong>blob</strong>은 파일 내용만, <strong>tree</strong>는 이름과 권한 모드를, <strong>commit</strong>은 루트 tree 해시와 parent 링크를 담는다.
          이 분리 덕에 파일 내용이 같으면 트리 어디서든 같은 blob 해시를 재사용하고, 커밋은 전체 스냅샷의 포인터로 동작한다.
        </Lead>

        <GitObjectModelDiagram />

        {/* 3-1 Strategy */}
        <H3>3-1. 전략 패턴으로 명령 확장</H3>
        <Lead>
          문자열 커맨드를 <Inline>CommandStrategy</Inline> 맵에서 찾아 위임한다.
          진입점은 고정되고, 새 명령은 맵 항목만 추가하면 된다.
        </Lead>

        <StrategyPatternDiagram />

        <CodeBlock filename="src/index.js" language="javascript" code={`// 진입점 — 문자열만으로 구현체 선택 후 위임
const strategy = CommandStrategy[command];
if (!strategy) {
  console.error(\`mini-git: '\${command}'은(는) 깃 명령이 아닙니다.\`);
  process.exit(1); // 명확한 실패 — 조용히 넘어가지 않음
}
strategy.run(args, gitDir);`} />

        {/* 3-2 Content-addressable */}
        <H3>3-2. Content-Addressable 객체 저장</H3>
        <Lead>
          Git이 객체를 저장하는 방식을 그대로 구현했다.
          <Inline>type size\0</Inline> 헤더와 본문을 이어 붙인 전체에 SHA-1을 내어 파일 경로를 결정한다.
          같은 내용이면 항상 같은 해시 — 중복 저장이 자연스럽게 억제된다.
        </Lead>

        <ContentAddressableDiagram />

        <CodeBlock filename="src/core/writeGitObject.js" language="javascript" code={`function writeGitObject(type, content, gitDir) {
  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content, 'utf-8');

  // Git과 동일한 헤더 포맷: "type size\\0"
  const header = \`\${type} \${buffer.length}\\0\`;
  const store = Buffer.concat([Buffer.from(header, 'utf-8'), buffer]);

  // SHA-1(헤더 + 본문) → 경로 결정
  const hash = crypto.createHash('sha1').update(store).digest('hex');
  const { objectDir, objectPath } = getObjectPath(gitDir, hash); // objects/ab/cde...

  if (!fs.existsSync(objectDir)) fs.mkdirSync(objectDir, { recursive: true });

  const compressed = zlib.deflateSync(store); // zlib 압축
  fs.writeFileSync(objectPath, compressed);
  return hash;
}`} />

        {/* 3-3 add */}
        <H3>3-3. <Inline>add</Inline> — 워킹 트리 → blob + index</H3>
        <Lead>
          파일 내용으로 blob 객체를 만들고, <Inline>filename → blobHash</Inline> 매핑을 JSON index에 기록한다.
          스테이징 영역이 워킹 트리와 다음 커밋 스냅샷을 분리하는 레이어임을 코드로 드러낸다.
        </Lead>

        <CodeBlock filename="src/commands/add.js" language="javascript" code={`// 워킹 트리 → blob 객체 → index(파일명 → 해시)
const content = fs.readFileSync(filePath, 'utf-8');
const hash = createBlobObject(content, gitDir); // writeGitObject('blob', ...)
addFileToIndex(filename, hash, gitDir);         // JSON index에 기록`} />

        {/* 3-4 commit */}
        <H3>3-4. <Inline>commit</Inline> — tree → commit → ref 갱신</H3>
        <Lead>
          index의 <Inline>filename → blobHash</Inline> 맵으로 tree 바이너리를 만들고,
          commit 객체에는 tree 해시와 parent 링크를 넣는다.
          새 commit 해시를 현재 브랜치 ref 파일에 덮어쓴다 — <strong>객체는 append-only, 바뀌는 것은 포인터뿐</strong>이다.
        </Lead>

        <CodeBlock filename="src/core/createTreeHash.js" language="javascript" code={`// tree 바이너리: mode name\\0 + 20바이트 raw hash 반복
const fileEntries = Object.entries(index).map(([filename, hash]) => {
  const entry = \`100644 \${filename}\\0\`; // 파일 이름·권한 모드는 tree에만
  const hashBuffer = Buffer.from(hash, 'hex');
  return Buffer.concat([Buffer.from(entry), hashBuffer]);
});
return writeGitObject('tree', Buffer.concat(fileEntries), gitDir);`} />

        <CodeBlock filename="src/commands/commit.js" language="javascript" code={`// 스냅샷 고정 + 부모 링크 + ref 이동
const treeHash = createTreeHash(index, gitDir);
const parent = fs.existsSync(branchPath)
  ? fs.readFileSync(branchPath, 'utf-8').trim()
  : null; // 첫 커밋이면 parent 없음

const commitContent = \`tree \${treeHash}
\${parent ? \`parent \${parent}\\n\` : ''}author \${author}
committer \${timestamp}

\${message}
\`;

const commitHash = writeGitObject('commit', commitContent, gitDir);
fs.writeFileSync(branchPath, commitHash); // ref만 이동 — 기존 객체 불변`} />

        <Callout>
          <strong>핵심 인사이트:</strong> 커밋이 diff가 아닌 트리 전체의 포인터라는 점, 그리고 "불변 객체 + 가변 포인터"라는 분리가 Git의 무결성 보장 기반이라는 점을 코드를 통해 직접 확인할 수 있다.
        </Callout>
      </DetailSection>
      </SectionGap>

      <SectionGap>

      {/* ── 04. 결과 ── */}
      <DetailSection id="mini-git-result" isLast>
        <SectionDivider number="04" label="결과" />
        <H2>Git의 시간 모델을 직접 추적</H2>

        <Lead>
          <Inline>init</Inline> / <Inline>add</Inline> / <Inline>commit</Inline> / <Inline>log</Inline> / <Inline>cat-file</Inline> 흐름으로
          "커밋이 트리 DAG 위의 노드"라는 Git 본체의 시간 모델을 직접 추적할 수 있다.
          실제 Git은 packfile·rebase·merge·reflog 등이 더 있지만,
          loose object + ref 갱신만으로도 <strong>무엇이 불변이고 무엇이 가변인지</strong>가 분리된다는 점을 체득했다.
        </Lead>

        <H3>지원 명령 흐름</H3>
        <DetailTable headers={["명령", "동작", "핵심 원리"]} rows={[
          { cells: ["init", ".mini-git/ 디렉터리 초기화", "저장소 구조 (objects/, refs/) 생성"] },
          { cells: ["add <file>", "blob 객체 생성 + JSON index 갱신", "스테이징이 별도 레이어임을 코드로 드러냄"] },
          { cells: ["commit -m", "tree → commit 객체 생성 + ref 이동", "스냅샷 포인터 + 불변 체인"] },
          { cells: ["log", "HEAD → parent 체인 순회 출력", "commit이 DAG 노드임을 직접 확인"] },
          { cells: ["cat-file -p <hash>", "객체 읽기·역직렬화", "content-addressable 조회 직접 확인"] },
        ]} />

        <H3>체득한 것</H3>

        <CategoryBlock num="01" name="사용자 체감 (본인 변화)" sub="git에 대한 두려움 → 도구에 대한 신뢰">
          <CategorySingle
            title="구현 후 reset/rebase를 자유롭게 쓰게 됐다"
            body={<>'한 번 만들어진 해시는 사라지지 않으니 뭘 잘못해도 ref만 되돌리면 살릴 수 있다'는 걸 직접 체득하면서, Git에 대한 막연한 공포가 도구에 대한 신뢰로 바뀌었다.</>}
          />
        </CategoryBlock>

        <CategoryBlock num="02" name="도구 가치 정직 평가" sub="web playground는 시연용에 가깝다">
          <CategorySingle
            title="누군가 이 도구로 본격적으로 학습하는 걸 본 적은 없다"
            body={<>지원 명령어가 init / add / commit / branch / checkout / log 수준이라 학습 도구로 쓰기엔 부족 — 현재는 동작을 시각적으로 확인하는 시연용. 명령어 범위 확장은 다음 단계로 두고 있다.</>}
          />
        </CategoryBlock>

        <CategoryBlock num="03" name="설계 트레이드오프" sub="실무 최적화 vs 학습 용이성">
          <CategorySingle
            title="모든 단순화 결정의 일관된 기준 — 흐름 이해 우선"
            body={<>실제 Git의 성능 최적화(packfile, index v2 바이너리)를 그대로 옮기면 학습 가치가 사라지기 때문에, 동작 의미는 유지하되 저장 형태는 JSON으로 단순화했다.</>}
          />
        </CategoryBlock>

        <CategoryBlock num="04" name="학습 사이클" sub="학습 경계를 의식적으로 그은 결정">
          <CategorySingle
            title="commit까지 구현해보니 '객체가 어떻게 움직이는지'엔 충분 — 머지·packfile은 다음 학습 주제로"
            body={<>처음엔 머지까지 가볼 생각으로 시작했는데, '두 parent + 충돌 해결'은 객체 움직임이 아니라 '병합 알고리즘'이라는 별도 주제라 의식적으로 경계 밖에 뒀다.</>}
          />
        </CategoryBlock>

        <H3>정직한 한계</H3>
        <LimitationGrid>
          <LimitationCard item="스테이징 (index)" status="JSON 파일로 단순화" note="실제 Git의 바이너리 index v2 포맷은 생략" />
          <LimitationCard item="parent 수" status="최대 1개 (선형 히스토리)" note="merge commit (parent 2개)는 미구현" />
          <LimitationCard item="packfile / GC" status="미구현" note="loose object만 — 대용량 저장소 비효율" />
          <LimitationCard item="원격 협업 (HTTP/SSH)" status="미구현" note="원리 검증 목적으로 의도된 트레이드오프" />
        </LimitationGrid>

        <DetailFurtherReading items={FURTHER_READING} />
      </DetailSection>
      </SectionGap>

    </DetailLayout>
  );
}
