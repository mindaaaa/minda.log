import { CheckCircle2, Globe, Layers, Terminal, XCircle, AlertTriangle } from "lucide-react";

const section = "w-full min-w-0 border border-white/20 bg-[rgba(20,20,20,0.95)] p-6 md:p-8";
const panelBox = "border border-white/18 bg-[rgba(20,20,20,0.95)]";
const outText = "leading-[1.7] text-gray-300";
const themeKey = "font-semibold text-[#FF2D55]";

export function MintDiArchitectureDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Layers className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-white">Core + Adapter DI</h3>
      </div>
      <div className="space-y-4">
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Core (platform-agnostic)</div>
          <div className="font-mono text-sm text-[#FF2D55]">Lexer -&gt; Parser -&gt; Evaluator</div>
          <div className="mt-2 text-xs text-gray-400">실행 파이프라인 단일화</div>
        </div>
        <div className="flex items-center justify-center py-1 text-gray-500">↓</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={`${panelBox} p-4`}>
            <div className="mb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">CLI Adapter</span>
            </div>
            <div className="text-xs text-gray-400">stdout -&gt; console / terminal formatter</div>
          </div>
          <div className={`${panelBox} p-4`}>
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-white">Web Adapter</span>
            </div>
            <div className="text-xs text-gray-400">stdout -&gt; UI state / DOM renderer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MintErrorSchemaDecisionDiagram() {
  return (
    <section className={section}>
      <div className="inline-block border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-400">
        Options
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-white/20 bg-[rgba(20,20,20,0.95)] p-8">
          <div className="mb-4 flex items-start gap-3">
            <XCircle className="mt-1 h-5 w-5 shrink-0 text-gray-500" />
            <div>
              <h4 className="mb-2 font-bold text-white">문자열 에러만 반환</h4>
              <p className="mb-4 text-sm text-gray-400">초기 구현은 단순</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 출처(origin) 분기 어려움</li>
                <li>• UI 하이라이트 불안정</li>
                <li>• 플랫폼별 포맷 중복</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border border-[#FF2D55]/85 bg-[rgba(20,20,20,0.95)] p-8">
          <div className="mb-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF2D55]" />
            <div>
              <h4 className="mb-2 text-lg font-extrabold text-white">공통 MintError 스키마</h4>
              <p className="mb-4 text-sm text-gray-400">host별 렌더링 분리</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• origin / hint / location 제공</li>
                <li>• CLI 컬러링 / Web 하이라이트 분리</li>
                <li>• 신규 host 추가 시 재사용 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          문자열 기반 에러 대신 <span className={themeKey}>구조화된 에러 객체</span>를 표준으로 고정해
          호스트별 표시 정책만 교체합니다.
        </p>
      </div>
      <div className="mt-5 flex items-start gap-2 text-xs text-gray-400">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
        <span>추가 호스트(TUI, IDE extension)에서도 동일 스키마를 그대로 사용할 수 있도록 설계.</span>
      </div>
    </section>
  );
}
