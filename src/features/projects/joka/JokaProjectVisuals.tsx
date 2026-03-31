import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle2, Eye, Layers, Monitor, Shield } from "lucide-react";

/** joka.md 프레젠테이션과 동일한 톤: 실색·고대비·블러 없음 */
const accent = "text-[#FF2D55]";
const accentMuted = "text-[#FF2D55]/90";
const accentBgSoft = "bg-[#FF2D55]/20";
const accentBar = "bg-[#FF2D55]";
const dot = "h-2 w-2 shrink-0 rounded-full bg-[#FF2D55]";
const textShadow = "[text-shadow:0_1px_2px_rgba(0,0,0,0.55)]";

const cardSolid = `rounded-xl bg-[#121212]/88 px-4 py-4 md:px-5 md:py-5 ${textShadow}`;
const cardNodeBase = `rounded-lg bg-[#161616]/86 text-center ${textShadow}`;
const textBody = "text-[#e5e5e5]";
const textMuted = "text-gray-400";
const textHint = "text-gray-500";
const chapterPanel =
  `rounded-2xl border border-white/22 bg-black/26 px-4 py-4 md:px-6 md:py-6 ` +
  `shadow-[0_6px_22px_rgba(0,0,0,0.22)] ${textShadow}`;

function DiagramTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className={`mb-5 text-sm font-bold uppercase tracking-[0.14em] text-white md:text-[15px] md:tracking-[0.16em] ${textShadow}`}>
      {children}
    </h3>
  );
}

function SoftBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${cardSolid} ${className}`}>{children}</div>;
}

function ChapterPanel({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return (
    <section className={`${chapterPanel} ${className}`} {...rest}>
      {children}
    </section>
  );
}

function Node({
  children,
  className = "",
  subtle = false,
}: {
  children: ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  return (
    <div
      className={`${cardNodeBase} px-3.5 py-2.5 text-[13px] leading-relaxed md:px-4 md:py-3 md:text-[14px] ${
        subtle ? `${textBody}` : `bg-[#1a1a1a]/90 ${textBody}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <span className={`block text-center text-lg font-light text-gray-500 ${className}`} aria-hidden>
      ↓
    </span>
  );
}

/** 개요: 모노레포 (joka.md / projects.md 정합) */
export function JokaIntroArchitectureDiagram() {
  return (
    <ChapterPanel className="mt-12 w-full min-w-0" aria-label="JOKA 모노레포 구조 개요">
      <DiagramTitle>모노레포 구조 개요</DiagramTitle>
      <div className="flex w-full min-w-0 flex-col items-stretch gap-3">
        <SoftBlock className="w-full text-center">
          <span className="font-semibold text-white">pnpm · Turborepo</span>
          <span className={`mt-1 block text-[12px] leading-relaxed md:text-[13px] ${textMuted}`}>
            루트 워크스페이스 · turbo test | build
          </span>
        </SoftBlock>
        <ArrowDown />
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
          <SoftBlock className="min-w-0 text-center">
            <span className={`font-semibold ${accentMuted}`}>apps/web</span>
            <span className={`mt-1 block text-[12px] leading-relaxed md:text-[13px] ${textMuted}`}>
              Vite 6 · React 19 · Query · Sentry
            </span>
          </SoftBlock>
          <SoftBlock className="min-w-0 text-center">
            <span className="font-semibold text-violet-300">packages/domain-media</span>
            <span className={`mt-1 block text-[12px] leading-relaxed md:text-[13px] ${textMuted}`}>
              Drizzle · 도메인 · Jest
            </span>
          </SoftBlock>
          <SoftBlock className="min-w-0 text-center">
            <span className="font-semibold text-cyan-300">infra/cloudflare</span>
            <span className={`mt-1 block text-[12px] leading-relaxed md:text-[13px] ${textMuted}`}>
              Wrangler · 배포 레이어
            </span>
          </SoftBlock>
        </div>
        <p className={`mt-3 text-center text-[12px] leading-relaxed md:text-[13px] ${textHint}`}>
          FSD 레이어링 · Husky · lint-staged · tsc — 품질 게이트
        </p>
      </div>
    </ChapterPanel>
  );
}

/** joka.md System Architecture — PWA 런타임 · 로깅 계층 · Auth 플로우 */
export function JokaSystemArchitectureTriptych() {
  return (
    <ChapterPanel className="mt-12 w-full min-w-0" aria-label="시스템 아키텍처: 런타임·로깅·인증">
      <DiagramTitle>System architecture</DiagramTitle>
      <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
        <SoftBlock className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Monitor className={`h-6 w-6 ${accent}`} aria-hidden />
            <h4 className="text-lg font-bold text-white">PWA runtime</h4>
          </div>
          <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>Browser</p>
          <ul className="mb-6 space-y-2.5 border-l-2 border-white/15 pl-4">
            {["Chrome", "Safari", "Firefox"].map((b) => (
              <li key={b} className={`flex items-center gap-2.5 text-sm leading-[1.8] ${textBody}`}>
                <span className={dot} />
                {b}
              </li>
            ))}
          </ul>
          <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>OS context</p>
          <ul className="space-y-2.5 border-l-2 border-white/15 pl-4">
            {["iOS", "Android", "Desktop"].map((b) => (
              <li key={b} className={`flex items-center gap-2.5 text-sm leading-[1.8] ${textBody}`}>
                <span className={dot} />
                {b}
              </li>
            ))}
          </ul>
        </SoftBlock>

        <SoftBlock className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Eye className={`h-6 w-6 ${accent}`} aria-hidden />
            <h4 className="text-lg font-bold text-white">Logging layer</h4>
          </div>
          <div className="space-y-5">
            {[
              { label: "Expected", hint: "Console", w: "25%", barClass: "bg-neutral-600" },
              { label: "Business", hint: "Sampled", w: "50%", barClass: "bg-[#FF2D55]/60" },
              { label: "Operational", hint: "Sentry", w: "75%", barClass: accentBar },
              { label: "Bug", hint: "Full", w: "100%", barClass: accentBar },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{row.label}</span>
                  <span className={`text-xs ${textHint}`}>{row.hint}</span>
                </div>
                <div className="h-1 overflow-hidden bg-white/10">
                  <div className={`h-full ${row.barClass}`} style={{ width: row.w }} />
                </div>
              </div>
            ))}
          </div>
        </SoftBlock>

        <SoftBlock className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Shield className={`h-6 w-6 ${accent}`} aria-hidden />
            <h4 className="text-lg font-bold text-white">Auth flow</h4>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accentBgSoft} ${accent}`}
              >
                1
              </span>
              <span className={`text-sm ${textBody}`}>OAuth login</span>
            </div>
            <div className="ml-4 h-8 w-0.5 bg-[#FF2D55]/50" aria-hidden />
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accentBgSoft} ${accent}`}
              >
                2
              </span>
              <span className={`text-sm ${textBody}`}>Whitelist check</span>
            </div>
            <div className="ml-4 h-8 w-0.5 bg-[#FF2D55]/50" aria-hidden />
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${accentBgSoft} ${accent}`}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              </span>
              <span className={`text-sm ${textBody}`}>Access granted</span>
            </div>
          </div>
        </SoftBlock>
      </div>
      <p className={`mt-5 text-[13px] leading-relaxed md:text-left md:text-[14px] ${textMuted}`}>
        조합·설치 모드별 재현 비용을 줄이기 위한 런타임 맥락 정리와, 계층·인가를 한 화면에서 엮어 봅니다.
      </p>
    </ChapterPanel>
  );
}

/** Challenge 1 보조: 계층 → Sentry 파이프라인 */
export function JokaObservabilityFlowDiagram() {
  return (
    <ChapterPanel className="w-full min-w-0 mt-2" aria-label="관측성: 로그 계층과 Sentry 파이프라인">
      <DiagramTitle>로그 계층 → Sentry 파이프라인</DiagramTitle>
      <div className="flex w-full min-w-0 flex-col gap-5">
        <div className="rounded-xl border border-[#FF2D55]/35 bg-black/35 p-3 md:p-4">
          <div className="w-full min-w-0 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5">
            <div className="flex min-w-min flex-wrap items-stretch justify-start gap-2.5 md:gap-3">
            <Node subtle>
              <span className="font-semibold text-white">expected</span>
              <span className={`mt-1 block text-[11px] md:text-[12px] ${textMuted}`}>console</span>
            </Node>
            <span className="self-center text-base text-gray-500">→</span>
            <Node>
              <span className="font-semibold text-amber-300">business</span>
              <span className={`mt-1 block text-[11px] md:text-[12px] ${textMuted}`}>샘플링</span>
            </Node>
            <span className="self-center text-base text-gray-500">→</span>
            <Node>
              <span className="font-semibold text-orange-300">operational</span>
              <span className={`mt-1 block text-[11px] md:text-[12px] ${textMuted}`}>화이트리스트</span>
            </Node>
            <span className="self-center text-base text-gray-500">→</span>
            <Node>
              <span className={`font-semibold ${accent}`}>bug</span>
              <span className={`mt-1 block text-[11px] md:text-[12px] ${textMuted}`}>ErrorBoundary</span>
            </Node>
            </div>
          </div>
        </div>
        <ArrowDown />
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-3 md:gap-3">
          <Node subtle>
            <span className="font-semibold text-white">beforeSend</span>
            <span className={`mt-1 block text-[11px] leading-snug md:text-[12px] ${textMuted}`}>
              applyBeforeSendFilter
            </span>
          </Node>
          <Node subtle>
            <span className="font-semibold text-white">sentry.policy</span>
            <span className={`mt-1 block text-[11px] leading-snug md:text-[12px] ${textMuted}`}>
              드롭 · 샘플링 · 마스킹
            </span>
          </Node>
          <Node subtle>
            <span className="font-semibold text-white">fingerprint</span>
            <span className={`mt-1 block text-[11px] leading-snug md:text-[12px] ${textMuted}`}>
              operationId · mediaState
            </span>
          </Node>
        </div>
      </div>
    </ChapterPanel>
  );
}

/** Challenge 2 보조 */
export function JokaAccessControlDiagram() {
  return (
    <ChapterPanel className="w-full min-w-0 mt-2" aria-label="접근 제어: OAuth 이후 Whitelist">
      <DiagramTitle>인가 흐름 (서버 정책)</DiagramTitle>
      <div className="flex w-full min-w-0 flex-col items-stretch gap-4">
        <div className="w-full min-w-0 overflow-x-auto pb-1">
          <div className="flex min-w-min flex-wrap items-center justify-start gap-2.5 text-[13px] md:text-[14px]">
            <Node>OAuth</Node>
            <span className="text-base text-gray-500">→</span>
            <Node>
              <span className="font-semibold text-emerald-300">식별자 수신</span>
            </Node>
            <span className="text-base text-gray-500">→</span>
            <Node>
              <span className="font-semibold text-cyan-300">Whitelist 검증</span>
              <span className={`mt-1 block text-[11px] md:text-[12px] ${textMuted}`}>미포함 시 차단</span>
            </Node>
            <span className="text-base text-gray-500">→</span>
            <Node>
              <span className="font-semibold text-white">미디어 / API</span>
            </Node>
          </div>
        </div>
        <p className={`w-full text-[13px] leading-relaxed md:text-left md:text-[14px] ${textMuted}`}>
          미인가 주체를 앱 가정이 아니라 서버에서 일관되게 차단하는 모델입니다.
        </p>
      </div>
    </ChapterPanel>
  );
}

/** Challenge 3 보조 */
export function JokaPlatformLayersDiagram() {
  const layers = ["app", "pages", "widgets", "features", "entities", "shared"];
  return (
    <ChapterPanel className="w-full min-w-0 mt-2" aria-label="apps/web 레이어와 패키지 경계">
      <DiagramTitle>apps/web 레이어 · 패키지 경계</DiagramTitle>
      <div className="flex w-full min-w-0 flex-col md:flex-row md:items-start md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {layers.map((name) => (
            <div
              key={name}
              className={`rounded-lg border border-white/10 bg-[#161616] px-3 py-2.5 text-[12px] font-medium ${textBody} md:text-[13px]`}
            >
              <span className="text-neutral-500">src/</span>
              {name}
            </div>
          ))}
        </div>
        <div className="mt-6 flex shrink-0 flex-col items-center gap-2 md:mt-10 md:w-28">
          <Layers className="h-4 w-4 text-neutral-600" aria-hidden />
          <p className={`text-center text-[12px] leading-relaxed ${textHint}`}>화면과 도메인 규칙 분리</p>
        </div>
        <div className="mt-6 flex min-w-0 flex-1 flex-col gap-2 md:mt-0">
          <SoftBlock className="min-w-0 text-center md:text-left">
            <span className="font-semibold text-violet-300">packages/domain-media</span>
            <span className={`mt-1 block text-[12px] md:text-[13px] ${textMuted}`}>도메인 · persistence</span>
          </SoftBlock>
          <p className={`text-center text-[12px] md:text-left md:text-[13px] ${textHint}`}>
            infra-object-storage · thumbnail 등
          </p>
        </div>
      </div>
    </ChapterPanel>
  );
}
