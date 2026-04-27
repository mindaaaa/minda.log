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
  OptionCard,
  OptionCardGrid,
  AchievementCard,
  AchievementGrid,
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

function PipelineDiagram() {
  const stages = [
    {
      label: 'source',
      sublabel: 'string',
      color: 'rgba(155,142,196,0.08)',
      border: DIAGRAM_INNER_BORDER,
    },
    {
      label: 'tokenize',
      sublabel: 'Lexer',
      color: 'rgba(155,142,196,0.14)',
      border: 'rgba(155,142,196,0.35)',
    },
    {
      label: 'tokens',
      sublabel: 'Token[]',
      color: 'rgba(155,142,196,0.08)',
      border: DIAGRAM_INNER_BORDER,
    },
    {
      label: 'parse',
      sublabel: 'Parser',
      color: 'rgba(155,142,196,0.14)',
      border: 'rgba(155,142,196,0.35)',
    },
    {
      label: 'program',
      sublabel: 'AST',
      color: 'rgba(155,142,196,0.08)',
      border: DIAGRAM_INNER_BORDER,
    },
    {
      label: 'evaluate',
      sublabel: 'Evaluator',
      color: 'rgba(155,142,196,0.14)',
      border: 'rgba(155,142,196,0.35)',
    },
    {
      label: 'RunResult',
      sublabel: 'ok / error',
      color: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.25)',
    },
  ];
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
        아키텍처 — 파이프라인 흐름
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {stages.map((s, i) => (
          <React.Fragment key={s.label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  background: s.color,
                  border: `1px solid ${s.border}`,
                  borderRadius: '10px',
                  padding: '9px 14px',
                  textAlign: 'center',
                  minWidth: '72px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#1a1a2e',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: '0.64rem',
                    color: 'rgba(0,0,0,0.4)',
                    marginTop: '2px',
                    fontFamily: 'monospace',
                  }}
                >
                  {s.sublabel}
                </div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <svg
                width='18'
                height='12'
                viewBox='0 0 18 12'
                fill='none'
                style={{ flexShrink: 0 }}
              >
                <path
                  d='M0 6h14M8 1l6 5-6 5'
                  stroke='rgba(155,142,196,0.45)'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          marginTop: '14px',
          borderTop: `1px solid ${DIAGRAM_BORDER}`,
          paddingTop: '12px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '8px',
            padding: '9px 14px',
            minWidth: '140px',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: DIAGRAM_ACCENT_DARK,
              marginBottom: '4px',
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
            flex: 1,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '8px',
            padding: '9px 14px',
            minWidth: '140px',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#ef4444',
              marginBottom: '4px',
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
          mint는 동일한 언어를 CLI(파일·stdio)와 웹 터미널 UI에서 실행하는
          인터프리터다. 두 환경의 I/O API가 다르기 때문에, 평가기 안에서 환경을
          직접 참조하면 분기가 늘어나고 이식성이 떨어지는 문제가 생긴다.
        </Lead>

        <BulletList
          items={[
            <>
              <strong className='text-foreground'>현상:</strong> 동일 언어를
              CLI와 웹에서 실행하려다 보면 코어와 I/O가 섞여 분기가 늘어난다.
            </>,
            <>
              <strong className='text-foreground'>원인 — 환경 API 오염:</strong>{' '}
              평가기 안에 <Inline>process.stdout</Inline>이나{' '}
              <Inline>window</Inline> 같은 호스트 API가 스며들면 다른 환경으로
              이식할 수 없다.
            </>,
            <>
              <strong className='text-foreground'>테스트 어려움:</strong> 환경
              API를 직접 호출하면 순수 함수처럼 검증하기 어렵고 목(mock) 처리가
              복잡해진다.
            </>,
            <>
              <strong className='text-foreground'>
                출력·에러 표현 불일치:
              </strong>{' '}
              CLI는 ANSI 컬러링, 웹은 DOM 하이라이트 — 플랫폼마다 에러 처리
              코드가 달라진다.
            </>,
          ]}
        />

        <Callout label='핵심 질문'>
          <strong>
            평가기 코어를 환경 독립적으로 유지하면서, 각 호스트(CLI·웹·테스트)가
            출력과 에러를 다르게 처리할 수 있는 구조를 어떻게 만들 것인가?
          </strong>
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

          <OptionCardGrid>
            <OptionCard
              letter='A'
              title='CLI용/Web용 평가기 복제'
              pros='각각 최적 UI 가능'
              cons='로직 드리프트, 버그 2배 — 유지 불가'
            />
            <OptionCard
              letter='B'
              title='단일 runSource + Lexer→Parser→Evaluator 파이프라인'
              pros='단일 진실 공급원 — 코어 100% 재사용'
              cons='경계 설계·에러 스키마 필요'
              chosen
            />
            <OptionCard
              letter='C'
              title='Core가 console.log 직접 호출'
              pros='디버깅 편할 수 있음'
              cons='호스트 교체·테스트 어려움'
            />
            <OptionCard
              letter='D'
              title='stdout 등을 옵션으로 주입(DI)'
              pros='CLI/웹 출력 전략 교체 용이'
              cons='호출 규약을 엄격히 문서화해야 함'
              chosen
            />
          </OptionCardGrid>

          <Callout>
            <strong>선택: B + D</strong> — 단일 <Inline>runSource</Inline>{' '}
            함수로 파이프라인을 통일하고, 출력은 <Inline>options.stdout</Inline>{' '}
            콜백으로만 내보내 호스트가 자유롭게 처리하도록 한다. 코어에는 환경
            API가 전혀 없다.
          </Callout>
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

          <AchievementGrid>
            <AchievementCard
              title='코어 재사용'
              description={
                <>
                  tokenize → parse → evaluate 파이프라인은 환경에 무관하게 동작
                  — CLI·웹·테스트가 하나의 코어를 공유한다.
                </>
              }
            />
            <AchievementCard
              title='확장 스토리 성립'
              description={
                <>
                  신규 호스트(IDE 플러그인 등)는 <Inline>options.stdout</Inline>{' '}
                  콜백과 에러 렌더러만 작성하면 된다.
                </>
              }
            />
            <AchievementCard
              title='에러 UI 근거 확보'
              description={
                <>
                  <Inline>location.line</Inline>·<Inline>hint</Inline>·
                  <Inline>origin</Inline>이 규격화되어 라인
                  하이라이트·툴팁·배지를 신뢰성 있게 구현할 수 있다.
                </>
              }
            />
            <AchievementCard
              title='테스트 용이성'
              description={
                <>
                  코어에 환경 API가 없으므로 <Inline>stdout</Inline>을 배열 push
                  콜백으로 교체하면 순수 함수처럼 검증할 수 있다.
                </>
              }
            />
          </AchievementGrid>

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
