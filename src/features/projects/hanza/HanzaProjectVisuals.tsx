import { CheckCircle2, Database, RefreshCw, XCircle, Zap } from "lucide-react";

const section = "w-full min-w-0 border border-white/20 bg-[rgba(20,20,20,0.95)] p-6 md:p-8";
const panelBox = "border border-white/18 bg-[rgba(20,20,20,0.95)]";
const outText = "leading-[1.7] text-gray-300";
const themeKey = "font-semibold text-[#FF2D55]";

export function HanzaCursorPaginationDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Database className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-white">Cursor + limit+1</h3>
      </div>
      <div className="space-y-4">
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Server Query</div>
          <div className="font-mono text-sm text-[#FF2D55]">limit + 1 fetch</div>
          <div className="mt-2 text-xs text-gray-400">다음 커서 존재 여부 판별</div>
        </div>
        <div className="flex items-center justify-center py-1 text-gray-500">↓</div>
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Client Response</div>
          <div className="font-mono text-sm text-white">items(limit) + cursor | null</div>
          <div className="mt-2 text-xs text-gray-400">hasMore 규칙 단순화</div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          offset 대신 <span className={themeKey}>커서 기반</span>으로 순서 안정성과 RANDOM 모드 재현성을 유지합니다.
        </p>
      </div>
    </section>
  );
}

export function HanzaPrefetchDecisionDiagram() {
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
              <h4 className="mb-2 font-bold text-white">소진 시점마다 fetch</h4>
              <p className="mb-4 text-sm text-gray-400">구현 단순</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 클릭 흐름 중 로딩 노출</li>
                <li>• RTT 대기가 UX를 절단</li>
                <li>• 무한 모드 몰입 저하</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border border-[#FF2D55]/85 bg-[rgba(20,20,20,0.95)] p-8">
          <div className="mb-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF2D55]" />
            <div>
              <h4 className="mb-2 text-lg font-extrabold text-white">잔여 5문항 이하 prefetch</h4>
              <p className="mb-4 text-sm text-gray-400">체감 지연 최소화</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>{"• `quizIndex >= quizList.length - 5`"}</li>
                <li>• id 기준 중복 제거 병합</li>
                <li>• 커서 상태 지속 관리</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF2D55]" />
            <span className="text-sm font-medium text-white">Prefetch Trigger</span>
          </div>
          <div className="text-xs text-gray-400">남은 문항 수가 임계치 이하일 때 비동기 선로딩</div>
        </div>
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-[#FF2D55]" />
            <span className="text-sm font-medium text-white">Choice Pool Refill</span>
          </div>
          <div className="text-xs text-gray-400">답변 누적 50문항마다 오답 후보 풀 보충</div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          prefetch와 보기 풀 보충을 함께 두어 <span className={themeKey}>무한 모드의 연속성</span>을 유지합니다.
        </p>
      </div>
    </section>
  );
}
