import { CheckCircle2, GitBranch, Package, Terminal, XCircle } from "lucide-react";

const section = "w-full min-w-0 border border-white/20 bg-[rgba(20,20,20,0.95)] p-6 md:p-8";
const panelBox = "border border-white/18 bg-[rgba(20,20,20,0.95)]";
const outText = "leading-[1.7] text-gray-300";
const themeKey = "font-semibold text-[#FF2D55]";

export function MiniGitCommandDispatchDiagram() {
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
              <h4 className="mb-2 font-bold text-white">거대 switch/if</h4>
              <p className="mb-4 text-sm text-gray-400">빠른 진입은 가능</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 명령 추가마다 분기 수정</li>
                <li>• 테스트 범위 확장</li>
                <li>• OCP 위반 가능성</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border border-[#FF2D55]/85 bg-[rgba(20,20,20,0.95)] p-8">
          <div className="mb-4 flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#FF2D55]" />
            <div>
              <h4 className="mb-2 text-lg font-extrabold text-white">전략 맵 + run(args, gitDir)</h4>
              <p className="mb-4 text-sm text-gray-400">명령별 모듈 위임</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 진입점 단일화</li>
                <li>• 명령별 독립 테스트</li>
                <li>• 등록 기반 확장</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          명령 분기를 하드코딩하지 않고 <span className={themeKey}>CommandStrategy 맵</span>으로 위임해,
          신규 명령은 등록만으로 확장합니다.
        </p>
      </div>
    </section>
  );
}

export function MiniGitObjectStorageDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <Package className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-white">Object Storage</h3>
      </div>
      <div className="space-y-4">
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Object Body</div>
          <div className="font-mono text-sm text-white">type + size + {"\\0"} + content</div>
          <div className="mt-2 text-xs text-gray-400">Git과 동일한 헤더 구조</div>
        </div>
        <div className="flex items-center justify-center py-1 text-gray-500">↓</div>
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Hash</div>
          <div className="font-mono text-sm text-[#FF2D55]">sha1(store)</div>
          <div className="mt-2 text-xs text-gray-400">동일 내용 = 동일 해시</div>
        </div>
        <div className="flex items-center justify-center py-1 text-gray-500">↓</div>
        <div className={`${panelBox} p-4`}>
          <div className="mb-2 text-xs text-gray-500">Disk Layout</div>
          <div className="font-mono text-sm text-white">.git/objects/aa/bb...</div>
          <div className="mt-2 text-xs text-gray-400">zlib 압축 저장 (loose object)</div>
        </div>
      </div>
    </section>
  );
}

export function MiniGitCommitFlowDiagram() {
  return (
    <section className={section}>
      <div className="mb-8 flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-[#FF2D55]" />
        <h3 className="text-xl font-bold text-white">add → tree → commit → ref</h3>
      </div>
      <div className="space-y-4">
        {[
          { icon: Terminal, label: "add: 워킹 파일을 blob + index로 고정" },
          { icon: Package, label: "tree: mode·filename·raw hash로 스냅샷 구성" },
          { icon: GitBranch, label: "commit: tree + parent + metadata를 객체화" },
          { icon: CheckCircle2, label: "ref: 객체는 불변, 브랜치 포인터만 이동" },
        ].map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D55]/20">
                  {i < 3 ? <span className="text-xs font-bold text-[#FF2D55]">{i + 1}</span> : <Icon className="h-4 w-4 text-[#FF2D55]" />}
                </div>
                <span className="text-sm text-white">{step.label}</span>
              </div>
              {i < 3 ? <div className="ml-4 h-8 border-l-2 border-[#FF2D55]" /> : null}
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-l-4 border-[#FF2D55] pl-6">
        <p className={`text-base ${outText}`}>
          커밋은 변경 요약이 아니라 <span className={themeKey}>tree 스냅샷 노드</span>이며, ref만 가변으로 움직여
          불변 히스토리를 유지합니다.
        </p>
      </div>
    </section>
  );
}
