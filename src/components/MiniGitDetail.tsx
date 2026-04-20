import React from "react";

import { DetailLayout, DetailSection, SectionGap } from "@/components/detail/DetailLayout";
import { Lead, H2, H3, BulletList, SectionDivider, Callout, Inline, DetailTable, CodeBlock } from "@/components/detail/DetailPrimitives";
import { OptionCard, OptionCardGrid, AchievementCard, AchievementGrid, LimitationCard, LimitationGrid, StackChip, StackRow, DocMeta } from "@/components/detail/DetailCards";
import { DetailActionButton, ActionRow } from "@/components/detail/DetailActionButton";
import { useHeroLayout } from "@/components/detail/DetailContext";
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
        { key: "기간", value: "2025.03 — 2025.06" },
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
        single: { src: "", caption: "CLI 데모" },
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
          문서만 읽으면 "커밋 = 변경 요약"으로 오해하기 쉬운데, 실제로 커밋 객체는
          루트 tree 해시와 parent 커밋 해시를 담은 포인터다. mini-git은 이 세 층을
          최소 형태로 직접 구현해 원리를 체득하기 위한 프로젝트다.
        </Lead>

        <BulletList items={[
          <><strong className="text-foreground">CLI 구조:</strong> 명령이 늘수록 진입점 <Inline>if/else</Inline>가 비대해지면 개방-폐쇄 원칙(OCP)이 깨지고 리그레션 범위가 불투명해진다.</>,
          <><strong className="text-foreground">모델 오해:</strong> "커밋 = 변경 요약"으로 오해하기 쉽지만, 실제로는 루트 tree 해시 + parent 커밋 해시가 커밋 객체에 들어간다. 파일 이름·권한 모드는 tree 엔트리에만 존재한다.</>,
          <><strong className="text-foreground">데이터 무결성:</strong> 워킹 디렉터리 파일은 언제든 망가질 수 있다. 객체 저장소를 append-only로 두고 상태 전이를 "새 객체 + ref 이동"으로만 표현하면 역사가 불변 체인으로 남는다.</>,
          <><strong className="text-foreground">학습 범위:</strong> packfile, merge, index v2 바이너리 등은 의도적으로 생략하고, loose object + zlib 수준에서 원리를 담보한다.</>,
        ]} />

        <Callout label="핵심 질문">
          <strong>Git의 세 층 — 콘텐츠 주소 저장소(객체), 가변 포인터(ref), 스테이징 영역(index) — 을 최소한의 코드로 직접 구현해 "무엇이 불변이고 무엇이 가변인지"를 체득할 수 있는가?</strong>
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
        <OptionCardGrid>
          <OptionCard letter="A" title="거대 switch/if" pros="빠른 PoC" cons="확장·테스트·코드 리뷰 비용 — OCP 위반" />
          <OptionCard letter="B" title="전략 맵 + run(args, gitDir)" pros="명령별 모듈 분리, 진입점 단일화" cons="맵 등록 누락 시 런타임 에러 (규약·리뷰로 보완)" chosen />
          <OptionCard letter="C" title="플러그인 로더" pros="확장성 극대" cons="학습·디버깅 난이도 상승" />
        </OptionCardGrid>
        <Callout>
          <strong>선택: B</strong> — 전략 맵(<Inline>CommandStrategy</Inline>)으로 진입점을 고정하고, 새 명령은 맵에 항목만 추가한다. 맵 등록 누락은 가드 분기로 조기 종료해 보완한다.
        </Callout>

        <H3>② 저장소 표현 방식 (진짜 Git과의 거리)</H3>
        <OptionCardGrid>
          <OptionCard letter="A" title="파일 복사 스냅샷만" pros="직관적" cons="중복 저장, dedup·무결성 검증 어려움" />
          <OptionCard letter="B" title="loose object + type size\0 헤더 + SHA-1 + zlib" pros="동일 내용 = 동일 해시(중복 방지), cat-file 사고방식 그대로" cons="packfile 압축·GC는 미구현" chosen />
          <OptionCard letter="C" title="실제 Git index 바이너리" pros="완전 호환" cons="파싱/직렬화 부담으로 학습 목적 흐려짐" />
        </OptionCardGrid>
        <Callout>
          <strong>선택: B</strong> + 스테이징은 JSON index로 단순화 — "스테이징이 별도 레이어라는 사실"만 유지. 실제 Git index 바이너리 포맷 구현은 학습 핵심을 흐리므로 생략했다.
        </Callout>
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
        <AchievementGrid>
          <AchievementCard title="blob에 경로 없음" description="파일 이름은 tree 엔트리에만 존재한다. 같은 내용의 파일은 어느 디렉터리에 있더라도 동일한 blob 해시를 가진다." />
          <AchievementCard title="커밋 = 스냅샷 포인터" description={<>커밋 객체는 diff가 아닌 루트 tree 해시를 담는다. "변경 이력"처럼 보이는 것은 parent 체인 순회로 파생된다.</>} />
          <AchievementCard title="불변 객체 + 가변 포인터" description="객체는 한 번 쓰면 덮어쓰지 않는다. 브랜치 파일(ref)만 새 commit 해시로 교체된다." />
          <AchievementCard title="중복 억제" description="동일 내용 재-add는 동일 blob 해시 → 추가 저장 없이 index만 갱신된다. O(1) dedup이 구조에서 자연스럽게 발생한다." />
        </AchievementGrid>

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
