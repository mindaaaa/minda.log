import React from 'react';

import {
  DetailLayout,
  DetailSection,
  SectionGap,
} from '@/components/detail/DetailLayout';
import {
  Lead,
  H2,
  H3,
  BulletList,
  SectionDivider,
  Callout,
  Inline,
  DetailTable,
  CodeBlock,
} from '@/components/detail/DetailPrimitives';
import {
  LimitationCard,
  LimitationGrid,
  StackChip,
  StackRow,
  DocMeta,
} from '@/components/detail/DetailCards';
import {
  DetailActionButton,
  ActionRow,
} from '@/components/detail/DetailActionButton';
import { useHeroLayout } from '@/components/detail/DetailContext';
import { DiscoveryTimeline } from '@/components/detail/DiscoveryTimeline';
import {
  GroupBox,
  ChosenCard,
  ChosenGrid,
  ExcludedHeading,
  ExcludedRow,
  DiscoveryBlock,
} from '@/components/detail/IdeationVisuals';
import {
  CategoryBlock,
  CategorySingle,
} from '@/components/detail/AchievementCategory';
import { Github, BookOpen } from 'lucide-react';
import {
  DetailFurtherReading,
  FurtherReadingItem,
} from '@/components/detail/DetailFurtherReading';

const ACCENT = '#a855f7';

// ─── Further Reading data ────────────────────────────────────────────────────

const FURTHER_READING: FurtherReadingItem[] = [
  {
    type: 'Wiki',
    title: 'Getting Started',
    description: 'Mint 설치 · 실행 · 첫 프로그램 작성',
    href: 'https://github.com/mindaaaa/mint/wiki/Getting-Started',
  },
  {
    type: 'Spec',
    title: '언어 가이드',
    description: '문법 · 타입 · 제어 흐름 · 함수 정의',
    href: 'https://github.com/mindaaaa/mint/wiki/%EC%96%B8%EC%96%B4-%EA%B0%80%EC%9D%B4%EB%93%9C',
  },
  {
    type: 'ADR',
    title: '언어 철학',
    description: 'Mint 설계 원칙과 트레이드오프 결정 배경',
    href: 'https://github.com/mindaaaa/mint/wiki/%EC%96%B8%EC%96%B4-%EC%B2%A0%ED%95%99',
  },
  {
    type: 'Wiki',
    title: 'Development',
    description: '인터프리터 개발 가이드 · 아키텍처 개요',
    href: 'https://github.com/mindaaaa/mint/wiki/Development',
  },
];

// ─── TOC config ───────────────────────────────────────────────────────────────

const TOC = [
  { id: 'mint-context', label: '상황 및 문제' },
  { id: 'mint-ideation', label: '고민한 방안' },
  { id: 'mint-solution', label: '해결 및 구현' },
  { id: 'mint-result', label: '결과' },
] as const;

// ─── Light-theme diagram constants ───────────────────────────────────────────

const DIAGRAM_BG = 'rgba(155, 142, 196, 0.04)';
const DIAGRAM_BORDER = 'rgba(155, 142, 196, 0.18)';
const DIAGRAM_ACCENT = '#9B8EC4';
const DIAGRAM_ACCENT_DARK = '#7B6FA6';
const DIAGRAM_INNER_BORDER = 'rgba(155, 142, 196, 0.25)';

// ─── Architecture Diagrams ─────────────────────────────────────────────────────

interface DataNodeProps {
  label: string;
  type: string;
  isFinal?: boolean;
}

function PipelineDataNode({ label, type, isFinal = false }: DataNodeProps) {
  const bg = isFinal ? 'rgba(16,185,129,0.08)' : '#fff';
  const border = isFinal ? 'rgba(16,185,129,0.3)' : DIAGRAM_INNER_BORDER;
  const labelColor = isFinal ? '#059669' : '#1a1a2e';
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: '12px 18px',
        textAlign: 'center',
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: labelColor,
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </div>
      <code
        style={{
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: 'rgba(0,0,0,0.5)',
          marginTop: 2,
          display: 'block',
        }}
      >
        {type}
      </code>
    </div>
  );
}

function PipelineFnArrow({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '6px 0 6px 12px',
        margin: '2px 0',
      }}
    >
      <svg width='14' height='28' viewBox='0 0 14 28' fill='none' style={{ flexShrink: 0 }}>
        <path
          d='M7 0v22M2 17l5 5 5-5'
          stroke='rgba(155,142,196,0.55)'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <div>
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: DIAGRAM_ACCENT_DARK,
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </code>
        <div
          style={{
            fontSize: '0.66rem',
            color: 'rgba(0,0,0,0.4)',
            marginTop: 1,
            fontFamily: 'monospace',
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function PipelineDiagram() {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${DIAGRAM_BORDER}`,
        background: DIAGRAM_BG,
        padding: '24px 24px 20px',
        marginBottom: '1.75rem',
      }}
    >
      <p
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: DIAGRAM_ACCENT_DARK,
          marginBottom: '18px',
        }}
      >
        아키텍처 — 파이프라인 흐름
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <PipelineDataNode label='source' type='string' />
        <PipelineFnArrow label='tokenize()' sub='Lexer' />
        <PipelineDataNode label='tokens' type='Token[]' />
        <PipelineFnArrow label='parse()' sub='Parser' />
        <PipelineDataNode label='program' type='AST' />
        <PipelineFnArrow label='evaluate()' sub='Evaluator + stdout 콜백' />
        <PipelineDataNode label='RunResult' type='ok | error' isFinal />
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: `1px solid ${DIAGRAM_BORDER}`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: DIAGRAM_ACCENT_DARK,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            성공
          </p>
          <code
            style={{
              fontFamily: 'monospace',
              fontSize: '0.76rem',
              color: '#1a1a2e',
              lineHeight: 1.6,
            }}
          >
            &#123; ok: true,
            <br />
            &nbsp;stdout: string[] &#125;
          </code>
        </div>
        <div
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#ef4444',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            실패
          </p>
          <code
            style={{
              fontFamily: 'monospace',
              fontSize: '0.76rem',
              color: '#1a1a2e',
              lineHeight: 1.6,
            }}
          >
            &#123; ok: false,
            <br />
            &nbsp;error: MintError &#125;
          </code>
        </div>
      </div>
    </div>
  );
}

function HostAdapterDiagram() {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${DIAGRAM_BORDER}`,
        background: DIAGRAM_BG,
        padding: '20px 24px',
        marginBottom: '1.75rem',
      }}
    >
      <p
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: DIAGRAM_ACCENT_DARK,
          marginBottom: '18px',
        }}
      >
        아키텍처 — 호스트 어댑터 패턴
      </p>

      {/* Core center */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        {/* Left: hosts */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <HostBox
            name='CLI Host'
            color='#0ea5e9'
            details={[
              'stdout: (v) => process.stdout.write(v)',
              'filename: "script.mint"',
              '에러 → ANSI 컬러링 출력',
            ]}
          />
          <HostBox
            name='Web Host'
            color={DIAGRAM_ACCENT}
            details={[
              'stdout: (v) => appendToTerminal(v)',
              '에러 → 라인 하이라이트 + 힌트 표시',
              'REPL 반복 실행 지원',
            ]}
          />
          <HostBox
            name='테스트 Host'
            color='#10b981'
            details={[
              'stdout: (v) => collected.push(v)',
              'env API 없이 순수 함수처럼 검증',
            ]}
          />
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <svg width='28' height='40' viewBox='0 0 28 40' fill='none'>
            <path
              d='M4 8 L24 20 L4 32'
              stroke='rgba(155,142,196,0.45)'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </svg>
        </div>

        {/* Right: runSource core */}
        <div
          style={{
            flex: 1.1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(155,142,196,0.1)',
              border: `2px solid rgba(155,142,196,0.3)`,
              borderRadius: '12px',
              padding: '14px 16px',
            }}
          >
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: DIAGRAM_ACCENT_DARK,
                marginBottom: '8px',
              }}
            >
              Core — runSource()
            </p>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              {[
                'tokenize(source)',
                'parse(tokens)',
                'evaluateProgram(ast, { stdout })',
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'rgba(155,142,196,0.15)',
                      border: `1px solid ${DIAGRAM_INNER_BORDER}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      color: DIAGRAM_ACCENT_DARK,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <code
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.73rem',
                      color: '#1a1a2e',
                    }}
                  >
                    {s}
                  </code>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: `1px solid ${DIAGRAM_BORDER}`,
              }}
            >
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'rgba(0,0,0,0.45)',
                  lineHeight: 1.55,
                }}
              >
                환경 API 없음 — 출력은 <Inline>options.stdout</Inline>{' '}
                콜백으로만
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HostBox({
  name,
  color,
  details,
}: {
  name: string;
  color: string;
  details: string[];
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${DIAGRAM_INNER_BORDER}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '0 8px 8px 0',
        padding: '9px 12px',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: '5px',
        }}
      >
        {name}
      </p>
      {details.map((d, i) => (
        <p
          key={i}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.67rem',
            color: 'rgba(0,0,0,0.45)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {d}
        </p>
      ))}
    </div>
  );
}

function ErrorSchemaDiagram() {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${DIAGRAM_BORDER}`,
        background: DIAGRAM_BG,
        padding: '20px 24px',
        marginBottom: '1.75rem',
      }}
    >
      <p
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: DIAGRAM_ACCENT_DARK,
          marginBottom: '18px',
        }}
      >
        아키텍처 — 공통 에러 스키마
      </p>
      <div
        className='grid grid-cols-1 min-[560px]:grid-cols-2'
        style={{ gap: '10px' }}
      >
        {/* MintError fields */}
        <div>
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.35)',
              marginBottom: '8px',
            }}
          >
            MintError 필드
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              {
                field: 'origin',
                type: 'MintErrorOrigin',
                desc: 'Lexer / Parser / Evaluator',
              },
              { field: 'hint', type: 'string?', desc: '수정 방향 제안' },
              {
                field: 'location',
                type: 'ErrorLocation?',
                desc: 'line, column, lexeme',
              },
              { field: 'message', type: 'string', desc: '사람이 읽는 설명' },
            ].map(({ field, type, desc }) => (
              <div
                key={field}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '7px',
                  padding: '7px 11px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'baseline',
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: DIAGRAM_ACCENT_DARK,
                    }}
                  >
                    {field}
                  </code>
                  <code
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.66rem',
                      color: 'rgba(0,0,0,0.35)',
                    }}
                  >
                    {type}
                  </code>
                </div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.45)',
                    margin: '2px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Host usage */}
        <div>
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.35)',
              marginBottom: '8px',
            }}
          >
            호스트별 에러 처리
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div
              style={{
                background: 'rgba(14,165,233,0.05)',
                border: '1px solid rgba(14,165,233,0.15)',
                borderRadius: '7px',
                padding: '9px 11px',
              }}
            >
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  marginBottom: '4px',
                }}
              >
                CLI
              </p>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(0,0,0,0.5)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                <Inline>origin</Inline> → 접두어 표시
                <br />
                <Inline>location</Inline> → ANSI 컬러링
                <br />
                <Inline>hint</Inline> → 회색 안내 출력
              </p>
            </div>
            <div
              style={{
                background: 'rgba(155,142,196,0.05)',
                border: `1px solid ${DIAGRAM_INNER_BORDER}`,
                borderRadius: '7px',
                padding: '9px 11px',
              }}
            >
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: DIAGRAM_ACCENT_DARK,
                  marginBottom: '4px',
                }}
              >
                Web
              </p>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(0,0,0,0.5)',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                <Inline>location.line</Inline> → 에디터 라인 하이라이트
                <br />
                <Inline>hint</Inline> → 툴팁으로 표시
                <br />
                <Inline>origin</Inline> → 오류 출처 배지
              </p>
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
  const isInline =
    heroLayout === 'inline-landscape' || heroLayout === 'inline-portrait';
  const titleSize = isInline ? HERO_TITLE_SIZE_INLINE : HERO_TITLE_SIZE_FULL;

  return (
    <>
      <h1
        style={{
          fontSize: titleSize,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.02,
          color: 'var(--doc-ink)',
          margin: '0 0 18px',
        }}
      >
        mint
      </h1>
      <p
        style={{
          fontSize: HERO_SUB_SIZE,
          color: 'var(--doc-ink-2)',
          fontWeight: 400,
          lineHeight: 1.55,
          margin: '0 0 32px',
          maxWidth: 640,
        }}
      >
        커스텀 스크립트 언어 인터프리터 — 환경 독립 파이프라인으로 CLI와 웹을
        하나의 코어로.
      </p>
      <DocMeta
        items={[
          { key: '역할', value: '개인 프로젝트' },
          { key: '기간', value: '2025.11, 2026.04 (web playground redesign)' },
          {
            key: '스택',
            value: (
              <StackRow>
                {[
                  'TypeScript',
                  'Lexer',
                  'Parser',
                  'AST',
                  'Evaluator',
                  'CLI',
                  'Web Playground',
                ].map((t) => (
                  <StackChip key={t} label={t} />
                ))}
              </StackRow>
            ),
          },
        ]}
      />
      <ActionRow>
        <DetailActionButton
          variant='primary'
          icon={<Github size={15} />}
          label='GitHub'
          href='https://github.com/mindaaaa/mint'
        />
        <DetailActionButton
          variant='ghost'
          icon={<BookOpen size={15} />}
          label='Wiki'
          href='https://github.com/mindaaaa/mint/wiki'
        />
      </ActionRow>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MintDetail({ onBack }: { onBack: () => void }) {
  return (
    <DetailLayout
      projectName='mint'
      toc={TOC}
      tocClassName='mint-toc'
      heroContent={<HeroContent />}
      heroVideo={{
        layout: 'inline-landscape',
        projectName: 'mint',
        single: {
          src: '/videos/mint/demo.webm',
          srcFallback: '/videos/mint/demo.mp4',
        },
      }}
      onBack={onBack}
      accent='#a855f7'
    >
      {/* ── 01. 상황 및 문제 ── */}
      <DetailSection id='mint-context'>
        <SectionDivider number='01' label='상황 및 문제' />
        <H2>코어와 I/O가 섞이면 이식성과 테스트가 동시에 무너진다</H2>

        <Lead>
          언어 인터프리터의 본질은 '같은 코드 → 같은 결과'라는 단일 매핑이고, 그 매핑은 호스트(CLI / 웹 / 테스트)에 영향받지 않아야 한다.
          평가기 안에 환경 API가 섞이는 순간 매핑이 호스트에 종속되고, 같은 언어가 호스트마다 다르게 동작하는 모순이 생긴다 —
          <strong className='text-foreground'> 코어는 그대로 유지하고 호스트마다 '문만 새로 파주는'</strong> 구조가 본질에 정합한다고 봤다.
        </Lead>

        <DiscoveryTimeline
          title='발견 순서 — CLI에서 시작했지만 처음부터 호스트 분리'
          steps={[
            {
              num: 'Step 1',
              eyebrow: '시작점',
              title: "CLI 단계부터 'Web 호스트 추가 가능성'을 가정한 설계",
              metas: [
                { key: '맥락', body: <>아키텍처 책에서 'infra와 core 분리'를 학습한 직후라, 평가기 코어는 stdout을 콜백으로 주입받고, CLI 호스트가 <Inline>process.stdout</Inline>을 콜백에 넘기는 구조로 시작했다.</> },
              ],
            },
            {
              num: 'Step 2',
              eyebrow: 'Web 추가 동기',
              title: '분리 필요성이 아니라 진입 장벽 때문',
              metas: [
                { key: '결정', body: <>'남이 내 프로젝트를 보려면 clone하고 세팅까지 해야 한다'는 진입 장벽 → Vercel 배포 + 예제 갤러리로 별도 설치 없이 체험 가능하게.</> },
              ],
            },
            {
              num: 'Step 3',
              eyebrow: '검증',
              title: 'Web 호스트 추가는 어댑터 작성만으로 끝났다',
              isFinal: true,
              metas: [
                { key: '결과', body: <>환경 분리가 처음부터 돼 있었기 때문에, 호스트가 늘어서 코어를 손볼 일이 생긴 적은 0건이었다.</> },
              ],
            },
          ]}
        />

        <p
          className='font-mono'
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--doc-ink-4)',
            margin: '28px 0 8px',
          }}
        >
          코어와 I/O가 섞일 때의 결과
        </p>
        <BulletList
          items={[
            <><strong className='text-foreground'>환경 API 오염:</strong> 평가기 안에 <Inline>process.stdout</Inline>이나 <Inline>window</Inline> 같은 호스트 API가 스며들면 다른 환경으로 이식할 수 없다.</>,
            <><strong className='text-foreground'>테스트 어려움:</strong> 환경 API를 직접 호출하면 순수 함수처럼 검증하기 어렵고 목(mock) 처리가 복잡해진다.</>,
            <><strong className='text-foreground'>출력·에러 표현 불일치:</strong> CLI는 ANSI 컬러링, 웹은 DOM 하이라이트 — 플랫폼마다 에러 처리 코드가 달라진다.</>,
          ]}
        />

        <Callout label='핵심 질문'>
          <strong>평가기 코어를 환경 독립적으로 유지하면서, 각 호스트가 출력과 에러를 다르게 처리할 수 있는 구조를 어떻게 만들 것인가?</strong>
        </Callout>
      </DetailSection>

      <SectionGap>
        {/* ── 02. 고민한 방안 ── */}
        <DetailSection id='mint-ideation'>
          <SectionDivider number='02' label='고민한 방안' />
          <H2>환경 분리 전략 4가지를 비교</H2>

          <Lead>
            코어를 어떻게 추상화하고, 출력을 어떻게 주입할지를 중심으로 네 가지
            방안을 검토했다. 구현 단순성과 이식성·테스트 용이성을 기준으로 최적
            조합을 결정했다.
          </Lead>

          <GroupBox>
            <ChosenGrid cols={2}>
              <ChosenCard
                letter='B'
                title='단일 runSource + Lexer→Parser→Evaluator 파이프라인'
                pros='단일 진실 공급원 — 코어 100% 재사용'
                cons='경계 설계·에러 스키마 필요'
              />
              <ChosenCard
                letter='D'
                title='stdout 등을 옵션으로 주입(DI)'
                pros='CLI/웹 출력 전략 교체 용이'
                cons='호출 규약을 엄격히 문서화해야 함'
              />
            </ChosenGrid>

            <ExcludedHeading />
            <ExcludedRow letter='A' title='CLI용/Web용 평가기 복제' cons='로직 드리프트, 유지 불가' />
            <ExcludedRow letter='C' title='Core가 console.log 직접 호출' cons='호스트 교체·테스트 어려움' />

            <DiscoveryBlock>
              이전 학습 코드에서 의존성 방향을 의식하지 않아 코어 로직에 인프라(파일 I/O, console 등)가 직접 박혀 있어,
              환경이 바뀔 때마다 코어를 손봐야 했고 결국 '새 전용 버전 통째로 복제'로 가던 패턴이 반복됐다.
              mint는 그 패턴을 반복하지 않으려 처음부터 코어와 호스트를 분리했고, 이것이 옵션 A를 시도조차 하지 않은 이유다.
              C는 Jest 같은 표준 테스트 도구의 자연스러운 사용을 막는 설계라 첫 테스트 작성 단계에서 자연스럽게 폐기됐다.
            </DiscoveryBlock>
          </GroupBox>

          <p style={{ fontSize: 14, color: "var(--doc-ink-2)", lineHeight: 1.7, margin: "20px 0 0" }}>
            <span
              className='font-mono'
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--doc-accent)',
                marginRight: 12,
              }}
            >
              결정
            </span>
            B + D 조합 — 단일 <Inline>runSource</Inline>로 파이프라인을 통일하고, 출력은 <Inline>options.stdout</Inline> 콜백으로만 내보내 코어에 환경 API가 전혀 없다.
          </p>

          <div
            style={{
              border: '1px solid var(--doc-line)',
              borderRadius: 12,
              margin: '20px 0 0',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 18px',
                background: 'var(--doc-bg-soft)',
                borderBottom: '1px solid var(--doc-line)',
              }}
            >
              <span
                className='font-mono'
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--doc-ink)',
                  background: '#fff',
                  border: '1px solid var(--doc-line)',
                  padding: '2px 9px',
                  borderRadius: 4,
                }}
              >
                회고
              </span>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--doc-ink)',
                }}
              >
                MintError origin 5종 결정 사고
              </span>
            </div>
            <p
              style={{
                margin: 0,
                padding: '16px 18px',
                fontSize: 13.5,
                lineHeight: 1.7,
                color: 'var(--doc-ink-2)',
              }}
            >
              두 가지 사고로 결정했다 — ① 실제 프로덕션 에러 로그 패턴을 참고해 origin이 발생 위치를 명확히 가리키게 하고,
              ② 인터프리터의 자연 단계(<Inline>LEXER / PARSER / EVALUATOR</Inline>) + 외부 인터페이스(<Inline>CLI</Inline>) + fallback(<Inline>UNKNOWN</Inline>)이 최소 충분 집합.
              호스트별 에러 처리가 다음 03 다이어그램에서 분리되는 결정의 출발점이다.
            </p>
          </div>
        </DetailSection>
      </SectionGap>

      <SectionGap>
        {/* ── 03. 해결 및 구현 ── */}
        <DetailSection id='mint-solution'>
          <SectionDivider number='03' label='해결 및 구현' />
          <H2>환경 독립 파이프라인 + DI stdout + 공통 에러 스키마</H2>

          <H3>파이프라인 구조</H3>
          <Lead>
            <Inline>tokenize → parse → evaluate</Inline>는 순수 문자열/AST
            기반으로만 동작한다. 어떤 환경 API도 코어에 들어오지 않으며, 출력은
            오직 <Inline>options.stdout</Inline> 콜백으로만 나간다.
          </Lead>

          <PipelineDiagram />

          <CodeBlock
            filename='app/run/runner.ts'
            code={`// 핵심: 환경 무관 실행 + 출력은 주입 콜백으로만
export function runSource(
  source: string,
  options: RunSourceOptions = {},
): RunResult {
  const context: MintErrorContext = { filePath: options.filename };
  try {
    const tokens = tokenize(source);
    const program = parse(tokens);
    const result = evaluateProgram(program, {
      stdout: (value) => options.stdout?.(value), // 호스트가 주입한 콜백 호출
    });
    return { ok: true, stdout: result.stdout };
  } catch (error) {
    return { ok: false, error: toMintError(error, context) };
  }
}`}
          />

          <H3>호스트 어댑터 패턴</H3>
          <Lead>
            CLI, 웹 플레이그라운드, 테스트 — 세 호스트 모두 동일한{' '}
            <Inline>runSource</Inline>를 호출한다. 각 환경에 맞는{' '}
            <Inline>stdout</Inline> 콜백을 주입하는 것만 다를 뿐이다. 신규
            호스트(IDE 플러그인 등)는 어댑터 한 개만 추가하면 된다.
          </Lead>

          <HostAdapterDiagram />

          <H3>공통 에러 스키마</H3>
          <Lead>
            Lexer·Parser·Evaluator 세 단계에서 발생하는 에러를{' '}
            <Inline>MintError</Inline> 하나로 통일한다.
            <Inline>origin</Inline>으로 출처를, <Inline>hint</Inline>로 수정
            방향을, <Inline>location</Inline>으로 위치를 담아 CLI와 웹이{' '}
            <strong>같은 객체</strong>로 각자의 UI 처리(컬러링·하이라이트)를
            수행한다.
          </Lead>

          <ErrorSchemaDiagram />

          <CodeBlock
            filename='app/run/errors.ts'
            code={`// 플랫폼 공통 에러 표현 — Lexer / Parser / Evaluator 출처 구분
export class MintError extends Error {
  public readonly origin: MintErrorOrigin; // 'LEXER' | 'PARSER' | 'EVALUATOR' | 'CLI' | 'UNKNOWN'
  public readonly hint?: string;           // "변수 선언 시 let 키워드를 사용하세요" 등
  public readonly location?: ErrorLocation; // { line, column, lexeme }

  constructor(options: MintErrorOptions) {
    super(options.message);
    this.name = 'MintError';
    this.origin = options.origin;
    this.hint = options.hint;
    this.location = options.location;
  }
}

// CLI 호스트 에러 처리 예시
function renderErrorCLI(err: MintError): void {
  const prefix = \`[\${err.origin.toUpperCase()}]\`;
  console.error(\`\${prefix} \${err.message}\`);              // 출처 접두어
  if (err.location) {
    console.error(\`  → line \${err.location.line}: \${err.location.lexeme}\`);
  }
  if (err.hint) console.error(\`  hint: \${err.hint}\`);     // 수정 방향
}

// Web 호스트 에러 처리 예시
function renderErrorWeb(err: MintError): void {
  highlightLine(err.location?.line);      // 에디터 라인 하이라이트
  showTooltip(err.hint);                  // 힌트 툴팁
  setBadge(err.origin);                   // 오류 출처 배지
}`}
          />

          <Callout>
            <strong>설계 원칙:</strong> 에러 스키마는 코어가 정의하고, 표현은
            호스트가 담당한다.
            <Inline>MintError</Inline> 객체 하나로 CLI·웹·테스트가 모두 같은
            분기를 탄다.
          </Callout>
        </DetailSection>
      </SectionGap>

      <SectionGap>
        {/* ── 04. 결과 ── */}
        <DetailSection id='mint-result' isLast>
          <SectionDivider number='04' label='결과' />
          <H2>단일 코어로 CLI·웹·테스트 세 호스트를 지원</H2>

          <Lead>
            <Inline>runSource</Inline> 코어 함수는 환경 API 없이 순수하게
            동작한다. CLI와 웹 플레이그라운드 모두 동일한 파이프라인을 공유하며,
            에러 스키마 표준화로 두 호스트가 같은 객체로 서로 다른 UI 처리를
            수행한다.
          </Lead>

          <CategoryBlock num='01' name='정량 관찰' sub='호스트가 늘어도 코어는 안 흔들렸다'>
            <CategorySingle
              title='CLI → Web → Test 호스트가 늘어나는 동안 runSource 코어 변경 0건'
              body={<>모든 호스트 추가는 <Inline>stdout</Inline> 콜백과 에러 렌더러 작성으로 끝났다. 한 건의 코어 fix(<Inline>+</Inline> 연산자 혼합 타입)는 환경 분리 한계가 아니라 단위 테스트 미커버 엣지케이스였다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num='02' name='설계 회고' sub='2026.04 Workbench 전면 개편'>
            <CategorySingle
              title='UI/어댑터 추가·교체만으로 끝났다 — 환경 분리 설계가 작동한 직접 증거'
              body={<>UI 레이어와 호스트 어댑터 작업은 코어를 건드리지 않고 끝났다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num='03' name='정직한 한계' sub='언어로 본격 프로그램은 짜보지 못함'>
            <CategorySingle
              title='mint 언어로 본격적인 프로그램을 짜본 경험은 부족하다'
              body={<>인터프리터 구현에 시간이 들어 예제 코드 수준에서만 검증했다. 클로저는 일부러 후속으로 미룬 결정으로, 직접 구현해본 경험이 추후 학습 깊이로 이어질 것이라 기대한다.</>}
            />
          </CategoryBlock>

          <CategoryBlock num='04' name='학습 동기' sub='이전 패턴을 반복하지 않으려는 의식적 결정'>
            <CategorySingle
              title='코어에 인프라가 박힌 과거 패턴을 반복하지 않기 위한 출발점'
              body={<>이전 학습 코드에서 한 부분 수정에도 코어 전체를 손봐야 했고 결국 '전용 버전 복제'로 갔던 패턴을 반복하지 않으려고, 처음부터 코어와 호스트를 분리했다.</>}
            />
          </CategoryBlock>

          <H3>정직한 한계</H3>
          <LimitationGrid>
            <LimitationCard
              item='라인 커버리지 수치'
              status='별도 측정 없음'
              note={'"코어 100% 재사용"은 아키텍처 목표 문구'}
            />
            <LimitationCard
              item='웹 플레이그라운드 UI'
              status='기본 터미널 UI'
              note='구문 강조·자동완성 등 추가 가능'
            />
            <LimitationCard
              item='에러 복구(error recovery)'
              status='첫 번째 에러에서 중단'
              note='계속 파싱 후 다중 에러 수집으로 개선 가능'
            />
            <LimitationCard
              item='언어 기능 범위'
              status='기본 연산·변수·제어 흐름'
              note='클로저·모듈 등은 후속 확장 안건'
            />
          </LimitationGrid>

          <DetailFurtherReading items={FURTHER_READING} />
        </DetailSection>
      </SectionGap>
    </DetailLayout>
  );
}
