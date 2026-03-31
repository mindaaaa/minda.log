import { CheckCircle2, Cpu, Database, Layers, Network, Smartphone, XCircle, Zap } from "lucide-react";

const section =
  "w-full min-w-0 rounded-2xl border border-slate-200/80 bg-white/55 p-5 md:p-7";
const panelBox = "rounded-xl border border-slate-200/80 bg-white/65";
const outText = "leading-[1.7] text-slate-700";
const themeKey = "font-semibold text-[#FF2D55]";

export function LocusGridFlowDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Network className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-slate-900">Grid Cache</h3>
      </div>
      <div className="space-y-4">
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-slate-500">queryKey</div>
          <div className="font-mono text-sm text-[#FF2D55]">roundBoundsToGrid()</div>
          <div className="mt-2 text-xs text-slate-500">격자 반올림 (0.01°)</div>
        </div>
        <div className="flex items-center justify-center py-2 text-slate-500">→</div>
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-slate-500">API Payload</div>
          <div className="font-mono text-sm text-slate-900">원본 bounds</div>
          <div className="mt-2 text-xs text-slate-500">서버 정밀도 유지</div>
        </div>
        <div className="mt-6 border-t border-slate-200/80 pt-4">
          <div className="mb-2 text-xs text-slate-500">확장 배수</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-700">Zoom ≥ 12</span>
              <span className="text-[#FF2D55]">3x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Zoom ≥ 8</span>
              <span className="text-[#FF2D55]">2x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">기본</span>
              <span className="text-[#FF2D55]">1.5x</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LocusMemoryFlowDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Cpu className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-slate-900">Memory Gov</h3>
      </div>
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">allFetchedRecords</span>
          </div>
          <div className={`${panelBox} p-3 text-xs`}>
            <div className="text-slate-500">Map&lt;id, {'{'} record, timestamp {'}'}&gt;</div>
            <div className="mt-2 text-[#FF2D55]">상한: 1000개</div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <span className="rotate-90 text-[#FF2D55]">→</span>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-900">visibleApiRecords</span>
          </div>
          <div className={`${panelBox} p-3 text-xs`}>
            <div className="text-slate-500">useMemo로 파생</div>
            <div className="mt-2 text-[#FF2D55]">화면 bounds 내만</div>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200/80 pt-4">
          <div className="mb-2 text-xs text-slate-500">정리 정책</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FF2D55]" />
              <span className="text-slate-700">Zoom &lt; 7: 전체 flush</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FF2D55]" />
              <span className="text-slate-700">&gt; 1000: 오래된 것 제거</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LocusSdkFlowDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Zap className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-slate-900">SDK Loading</h3>
      </div>
      <div className="space-y-4">
        {["loadingPromise 싱글톤", "스크립트 동적 삽입", "컨테이너 크기 체크", "rAF 폴링 대기"].map((label, i) => (
          <div key={label}>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D55]/20">
                <span className="text-xs font-bold text-[#FF2D55]">{i + 1}</span>
              </div>
              <span className="text-sm text-slate-800">{label}</span>
            </div>
            <div className="ml-4 h-8 border-l-2 border-[#FF2D55]" />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D55]/20">
            <CheckCircle2 className="h-4 w-4 text-[#FF2D55]" />
          </div>
          <span className="text-sm text-slate-800">맵 인스턴스 생성</span>
        </div>
      </div>
    </section>
  );
}

export function LocusMobileUxDiagram() {
  return (
    <section className={section}>
      <div className="inline-block border border-blue-200/70 bg-blue-50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-700">
        Options
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white/65 p-4 md:p-6">
          <div className="mb-4 flex items-start gap-3">
            <XCircle className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <h4 className="mb-2 font-bold text-slate-900">별도 라우트 풀페이지</h4>
              <p className="mb-4 text-sm text-slate-500">구현이 익숙함</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• 지도 컨텍스트와 분리</li>
                <li>• 뒤로가기 시 맵 재초기화</li>
                <li>• 공간 정보 손실</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/65 p-4 md:p-6">
          <div className="mb-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF2D55]" />
            <div>
              <h4 className="mb-2 text-lg font-extrabold text-slate-900">BottomSheet + 지도 오버레이</h4>
              <p className="mb-4 text-sm text-slate-500">한 손·지도 고정 UX</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• 지도 위에 시트 오버레이</li>
                <li>• 공간 컨텍스트 유지</li>
                <li>• 한 손 조작 최적화</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          <span className={themeKey}>BottomSheet 패턴</span>을 선택. 지도 위 시트·핀 선택·연결선 상태를
          분리해 흐름을 유지합니다.
        </p>
      </div>
    </section>
  );
}

export function LocusSentryGuardDiagram() {
  return (
    <section className={section}>
      <div className="inline-block border border-blue-200/70 bg-blue-50 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-700">
        Options
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-white/65 p-4 md:p-6">
          <div className="mb-4 flex items-start gap-3">
            <XCircle className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <h4 className="mb-2 font-bold text-slate-900">경고마다 Sentry 전송</h4>
              <p className="mb-4 text-sm text-slate-500">초기엔 단순</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• 노이즈 급증</li>
                <li>• 쿼터 소모</li>
                <li>• 진짜 이슈 가시성 저하</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/65 p-4 md:p-6">
          <div className="mb-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF2D55]" />
            <div>
              <h4 className="mb-2 text-lg font-extrabold text-slate-900">warn + 선택적 Sentry</h4>
              <p className="mb-4 text-sm text-slate-500">운영 단계별 제어</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• 빈번 케이스는 로컬 warn</li>
                <li>• 중요 케이스만 전송</li>
                <li>• 쿼터 보호 + 맥락 유지</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          bounds 경고는 기본 warn으로 남기고, 운영 의미가 큰 케이스만 <span className={themeKey}>`sendToSentry`</span>로
          올려 노이즈를 억제합니다.
        </p>
      </div>
    </section>
  );
}

