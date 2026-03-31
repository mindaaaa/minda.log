import type { Project } from "../model/types";

export const projects: Project[] = [
  {
    id: 1,
    slug: "joka",
    title: "JOKA (가족 중심 사진 아카이브 PWA)",
    period: "2026.01 – 현재",
    role: "Co-founder & Frontend Lead · 2인 팀",
    description:
      "가족 사진·메타데이터를 다루는 PWA. 모노레포·계층 로그·Sentry 정책으로 재현 가능한 관측성을 만들고, OAuth 이후 Whitelist 2단 접근으로 폐쇄적 가족 단위 통제를 지향합니다.",
    longDescription:
      "pnpm 워크스페이스·Turborepo 기반 모노레포에서 웹(`apps/web`: Vite 6, React 19)과 도메인·인프라 패키지를 분리했습니다. Locus에서 겪은 추적 공백을 반복하지 않기 위해 레이어별 로깅·Sentry `beforeSend`·fingerprint·ErrorBoundary를 엔트리에서 고정했고, 제품 특성상 서버 Whitelist 인가와 샘플링·마스킹 정책을 전제로 설계했습니다.",
    tags: ["PWA", "Vite", "React 19", "Sentry", "Turborepo", "TypeScript", "Drizzle", "OAuth"],
    gradient: "from-rose-200 to-pink-200",
    github: "#",
    live: "#",
    metrics: [
      { label: "웹 스택", value: "Vite 6 · R19", hint: "Query · Sentry 연동" },
      { label: "관측성", value: "레이어 로그", hint: "expected / business / bug" },
      { label: "인가", value: "OAuth + WL", hint: "서버 정책 전제" },
    ],
    challenges: [
      {
        id: "joka-observability",
        title: "Challenge 1 · 관측성 — 재현 가능한 실패 맥락",
        tocLabel: "관측성 · Sentry",
        problem: {
          tldr:
            "재현 비용·MTTI·로깅 노이즈를 동시에 줄이는 관측 설계가 필요했다.",
          bulletPoints: [
            "재현 비용: OS·브라우저·설치 모드마다 동일 코드도 증상이 달라 추적이 어렵다",
            "MTTI: 사용자·환경 맥락이 비면 원인 특정이 늦어진다",
            "과도한 로깅: 노이즈·PII 위험으로 역행한다",
          ],
          body: "",
        },
        approach: {
          tldr:
            "콘솔 과다 로깅 대신 Breadcrumbs·Sentry, 공개 회원제 대신 OAuth 이후 Whitelist로 미인가를 서버에서 막는 B+D를 택했다.",
          bulletPoints: [
            "A안(클라만 verbose): 서버·기기 맥락 단절",
            "B+D: Breadcrumbs·Sentry + OAuth 후 Whitelist로 서버에서 차단",
            "운영 전제: 드롭·샘플링·마스킹",
          ],
          asideNote:
            "클라만 A안이면 맥락이 끊기고, C안(공개 회원제)만이면 가족 단위 폐쇄성에 불리하다는 판단.",
          body: "",
        },
        solution: {
          tldr:
            "복잡한 런타임에서도 재현 가능한 실패 맥락을 확보하기 위해, 클라이언트 관측 뼈대를 코드로 고정했다.",
          bulletPoints: [
            "`initSentry` 1회 + `beforeSend` 연동",
            "`sentry.policy` 드롭/샘플링 적용",
            "`fingerprint`: `operationId`·`mediaState`",
            "`ErrorBoundary` + `log` 4계층 고정",
          ],
          asideNote: "Locus에서 겪은 추적 공백을 재발 방지 지표로 삼았다.",
          body: "",
          codeSnippet: {
            filename: "apps/web/src/shared/lib/logger/index.ts",
            language: "typescript",
            code: `// 요지: 레이어별 Console vs Sentry
const log = {
  expected(message: string, context?: LogContext): void {
    /* console only */
  },
  business(message: string, context?: LogContext): void {
    /* 샘플링 시 sendToSentry('info', ...) */
  },
  operational(message: string, context?: LogContext): void {
    sendToSentry('warning', 'operational', message, context);
  },
  bug(error: Error, context?: LogContext): void {
    sendToSentry('error', 'bug', error, context);
  },
};`,
          },
          deepDive: {
            title: "코드 기준으로 확정된 것 / 재확인 권장",
            content:
              "• Breadcrumbs·PWA display mode — 같은 방향으로 확장 가능.\n• Whitelist·vite-plugin-pwa — 배포 브랜치·API 레포와 재대조 권장.",
          },
        },
        outcome: {
          tldr:
            "정량은 프로덕션 관측 후 보강. 이슈 지점을 바로 찍을 수 있는 구조와 레이어 표준을 우선했다.",
          bulletPoints: [
            "이전 시행착오를 레이어·정책 단위 표준으로 정리",
            "프로덕션 수치는 배포 후 대시보드로 보강 예정",
          ],
          body: "",
        },
      },
      {
        id: "joka-access",
        title: "Challenge 2 · 민감 데이터와 접근 제어",
        tocLabel: "인가 · Whitelist",
        problem: {
          tldr:
            "가족 단위 폐쇄성과 오남용 방지를, 작은 팀이 운영·보안·관측까지 동시에 감당할 구조로 맞춰야 했다.",
          bulletPoints: [
            "일반 가입+앱 역할만으로는 폐쇄성에 불리할 수 있다",
            "소규모 팀은 운영·보안·관측을 동시에 감당해야 한다",
          ],
          body: "",
        },
        approach: {
          tldr:
            "공개 회원제보다 `OAuth` 이후 `Whitelist`로 미인가 식별자를 서버 정책에서 차단했다.",
          bulletPoints: [
            "C안: 폐쇄성 설명이 약해질 수 있음",
            "D안: `OAuth` 후 `Whitelist`만 접근",
            "트레이드오프: 화이트리스트 운영 비용",
          ],
          asideNote:
            "인가를 앱 가정만이 아니라 서버 단일 정책으로 고정해 설명 가능한 모델을 유지한다.",
          body: "",
        },
        solution: {
          tldr:
            "`OAuth` 통과 후 `Whitelist` 식별자만 접근하도록 인가를 서버 정책으로 고정했다.",
          bulletPoints: [
            "미들웨어·경로를 배포 레포와 대조",
            "`PII`·감사 로그 정책 일치 확인",
          ],
          body: "",
        },
        outcome: {
          tldr: "서버 권한 단일화로 도메인 신뢰와 구현 단순함 사이 설명 가능한 모델을 유지한다.",
          bulletPoints: ["클라만 믿지 않고 서버 경로를 명확히 한다"],
          body: "",
        },
      },
      {
        id: "joka-platform",
        title: "Challenge 3 · 모노레포 · 도메인 · 웹 구조",
        tocLabel: "모노레포 · FSD",
        problem: {
          tldr:
            "한 레포에 프론트·도메인·인프라가 붙으면 경계가 흐려지고, 화면만 커지면 테스트·배포 단위가 불명확해진다.",
          bulletPoints: [
            "한 덩어리 레포는 오너십·검증 범위가 흐려진다",
            "화면만 비대해지면 회귀 비용이 커진다",
          ],
          body: "",
        },
        approach: {
          tldr:
            "`apps/web` 레이어, `domain-media`, `infra`를 분리해 경계를 고정했다.",
          bulletPoints: [
            "`apps/web`: app~shared 레이어",
            "`domain-media`: `Drizzle`·`Jest`",
            "`infra/cloudflare`: 배포 어댑터",
          ],
          asideNote: "‘어디를 고치면 어디까지 검증하는지’ 경계를 고정한다.",
          body: "",
        },
        solution: {
          tldr:
            "`pnpm`·`turbo` 품질 게이트와 `PWA` 브랜치 정합을 함께 관리한다.",
          bulletPoints: [
            "루트: `pnpm` + `turbo test|build`",
            "품질: `Husky`·`lint-staged`·`tsc`",
            "`PWA` 불일치 시 문서·브랜치 재대조",
          ],
          body: "",
        },
        outcome: {
          tldr: "패키지 경계로 화면 변경과 도메인 규칙 변경의 책임을 나누어 검증 범위를 줄였다.",
          bulletPoints: ["UI는 apps/web, 규칙은 domain 패키지 중심으로 추적"],
          body: "",
        },
      },
    ],
    closing: {
      title: "결과 및 회고",
      tldr:
        "Sentry·레이어·Boundary로 웹 관측 뼈대는 코드에 고정됐고, Whitelist·PWA·API는 배포와 맞추며 갱신할 항목으로 남는다.",
      bulletPoints: [
        "‘추적 가능한 실패’ 전제로 운영 습관 점검",
        "이력서·문서는 브랜치·경로와 주기적 대조",
      ],
      body: "",
    },
    wikiCard: {
      teaser: "표준 근거 문서(draft.md)와 레포 경로 대조 체크리스트가 있습니다.",
      url: "#",
      linkLabel: "결정 노트 · 체크리스트",
    },
  },
  {
    id: 2,
    slug: "locus",
    title: "Locus (공간 기반 기록 서비스)",
    period: "2025.08 – 2026.02",
    role: "Frontend Lead · Naver Boostcamp 그룹 프로젝트",
    description:
      "지도·기록·렌더·메모리·SDK·모바일 UX가 한 화면에서 겹치는 도메인입니다. 격자 queryKey 안정화, 런타임 메모리 상한, 동적 SDK·rAF, 바텀시트, 선택적 Sentry로 비용·체감을 같이 맞췄습니다.",
    longDescription:
      "부스트캠프 팀 프로젝트로 지도 기반 기록 서비스를 만들었습니다. `boundsUtils`·TanStack Query로 패닝 시 캐시 재사용, MapViewport에서 fetch 누적·visible 파생·줌 flush로 메모리 곡선을 관리하고, `naverMapLoader`·`useMapInstance`로 스크립트 싱글톤·컨테이너 rAF를 정렬했습니다.",
    tags: ["지도", "TanStack Query", "메모리", "rAF", "BottomSheet", "Sentry"],
    gradient: "from-violet-200 to-fuchsia-200",
    github: "#",
    live: "#",
    metrics: [
      { label: "Lighthouse", value: "55 → 71", hint: "이력서·draft 정합" },
      { label: "캐시 키", value: "0.01° 격자", hint: "payload는 원본 bounds" },
      { label: "런타임 상한", value: "기록 1000", hint: "저줌 flush" },
    ],
    challenges: [
      {
        id: "locus-grid-query",
        title: "Challenge 1 · 격자 캐시와 TanStack Query",
        tocLabel: "격자 · Query",
        problem: {
          body:
            "지도를 조금만 움직여도 bounds가 바뀌어 API가 반복되면 비용·깜빡임이 동시에 커집니다. queryKey가 미세 패닝마다 달라지면 캐시가 사실상 없는 것과 같습니다.",
        },
        approach: {
          body:
            "A(매 pan fetch) 대신 B(확장 bounds + 줌별 배수)와 D(queryKey = 격자 반올림, 요청 payload = 원본 bounds)를 택했습니다. ‘키와 요청이 다르다’는 팀 합의가 필요합니다.",
        },
        solution: {
          body:
            "0.01° 격자로 `roundBoundsToGrid`, Query `queryKey`는 격자, `queryFn`에는 원본 bounds를 그대로 넘깁니다. `getExpansionFactor`로 줌 12+ 에서 3배 등 확장 prefetch. `staleTime` 등으로 재요청을 줄입니다.",
          codeSnippet: {
            filename: "boundsUtils.ts · useGetRecordsByBounds.ts",
            language: "typescript",
            code: `const GRID_SIZE = 0.01;
function gridIndexToCoord(gridIndex: number): number {
  return gridIndex * GRID_SIZE;
}

export function roundBoundsToGrid(bounds: Bounds): Bounds {
  return {
    neLat: gridIndexToCoord(Math.ceil(bounds.neLat / GRID_SIZE)),
    neLng: gridIndexToCoord(Math.ceil(bounds.neLng / GRID_SIZE)),
    swLat: gridIndexToCoord(Math.floor(bounds.swLat / GRID_SIZE)),
    swLng: gridIndexToCoord(Math.floor(bounds.swLng / GRID_SIZE)),
  };
}

export function getExpansionFactor(zoom: number): number {
  if (zoom >= 12) return 3;
  if (zoom >= 8) return 2;
  return 1.5;
}

// —— Query 훅 ——
const gridBounds = request ? roundBoundsToGrid({ ...request }) : null;

return useQuery({
  queryKey: ['records', 'bounds', gridBounds],
  queryFn: () => getRecordsByBounds(request!),
  staleTime: 300_000,
});`,
          },
        },
        outcome: {
          body:
            "패닝 구간에서 같은 격자 캐시를 재사용해 네트워크·깜빡임을 줄였습니다. 고정 격자는 줌별 밀도 차이를 완벽히 반영하진 못해 쿼드트리 등은 후속 검토로 남습니다.",
        },
      },
      {
        id: "locus-memory-visible",
        title: "Challenge 2 · 메모리 거버넌스와 화면 내 레코드만 렌더",
        tocLabel: "메모리 · visible",
        problem: {
          body:
            "확장 bounds로 가져온 기록을 항상 마커로 유지하면 맵·DOM 부담으로 저사양 기기에서 프리징이 납니다.",
        },
        approach: {
          body:
            "A(전량 렌더) 대신 B(Map 누적 + 상한 + 오래된 것 제거), C(저줌에서 캐시 flush), D(화면 bounds 안만 derive)를 조합했습니다.",
        },
        solution: {
          body:
            "`allFetchedRecords`를 Map으로 두고, 화면 bounds 안만 `visibleApiRecords`로 파생합니다. 상한(예: 1000) 초과 시 타임스탬프 정렬로 잘라내고, 줌이 임계(예: 7) 미만이면 광역 뷰로 보고 맵을 비웁니다.",
          codeSnippet: {
            filename: "MapViewport.tsx",
            language: "typescript",
            code: `const MAX_RECORDS = 1000;
const LOW_ZOOM_THRESHOLD = 7;

useEffect(() => {
  setAllFetchedRecords((prev) => {
    if (currentZoom < LOW_ZOOM_THRESHOLD) return new Map();
    if (prev.size <= MAX_RECORDS) return prev;
    const sorted = Array.from(prev.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    );
    return new Map(sorted.slice(-MAX_RECORDS));
  });
}, [currentZoom]);

const visibleApiRecords = useMemo(() => {
  if (!currentViewBounds || allFetchedRecords.size === 0) return [];
  const visible: ApiRecord[] = [];
  allFetchedRecords.forEach(({ record }) => {
    if (isWithinBounds(record, currentViewBounds)) visible.push(record);
  });
  return visible;
}, [currentViewBounds, allFetchedRecords]);`,
          },
        },
        outcome: {
          body:
            "장시간 탐색에서도 상한이 있어 런타임 곡선이 안정적으로 보입니다.",
        },
      },
      {
        id: "locus-sdk-raf",
        title: "Challenge 3 · SDK 동적 로딩 · 싱글톤 · 컨테이너 rAF",
        tocLabel: "SDK · rAF",
        problem: {
          body:
            "Naver Maps SDK는 스크립트·초기화가 무겁고, 컨테이너 크기 0에서 붙이면 실패하거나 화이트아웃에 가깝게 보일 수 있습니다.",
        },
        approach: {
          body:
            "A(index 동기 태그) 대신 B(동적 삽입·`loadingPromise` 싱글톤), C(컨테이너 0이면 rAF로 재시도)를 택했습니다. 첫 페인트 정렬은 main.tsx 주석과 같은 의도로 짧은 지연을 둡니다.",
        },
        solution: {
          body:
            "`loadNaverMapScript`에서 중복 로드 방지, `useMapInstance`에서 `offsetWidth/Height` 확인 후 다음 프레임까지 rAF 폴링합니다.",
          codeSnippet: {
            filename: "naverMapLoader.ts · useMapInstance.ts",
            language: "typescript",
            code: `let loadingPromise: Promise<void> | null = null;

export function loadNaverMapScript(): Promise<void> {
  if (window.naver?.maps) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = NAVER_MAP_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("SDK load failed"));
    document.head.appendChild(script);
  });
  return loadingPromise;
}

function waitUntilContainerReady(el: HTMLElement, done: () => void) {
  if (el.offsetWidth > 0 && el.offsetHeight > 0) return done();
  requestAnimationFrame(() => waitUntilContainerReady(el, done));
}`,
          },
        },
        outcome: {
          body:
            "메인 스레드 점유와 초기 레이아웃 레이스를 줄여 프리징·화이트아웃 체감을 완화했습니다.",
        },
      },
      {
        id: "locus-mobile-ux",
        title: "Challenge 4 · 모바일 — BottomSheet와 지도 컨텍스트",
        tocLabel: "모바일 UX",
        problem: {
          body:
            "한 손 조작·하단 시트가 없으면 지도·상세·생성 흐름이 뷰포트 안에서 경합니다.",
        },
        approach: {
          body:
            "A(상세 풀페이지) 대신 B(BottomSheet + 지도 위 오버레이)로 같은 화면에서 맥락을 유지했습니다.",
        },
        solution: {
          body:
            "`MapViewport`에서 시트 열림·핀·연결선 토글 등을 state로 나누어 지도 탐색과 상세 시 경쟁을 줄였습니다.",
          codeSnippet: {
            filename: "MapViewport.tsx",
            language: "typescript",
            code: `const [isSheetOpen, setIsSheetOpen] = useState(false);
const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
const [showConnectionLine, setShowConnectionLine] = useState(false);

const openDetail = (pinId: string) => {
  setSelectedPinId(pinId);
  setShowConnectionLine(true);
  setIsSheetOpen(true);
};

const closeDetail = () => {
  setIsSheetOpen(false);
  setShowConnectionLine(false);
};`,
          },
        },
        outcome: {
          body:
            "모바일에서 지도 고정·한 손 흐름이 자연스럽게 이어지도록 맞췄습니다.",
        },
      },
      {
        id: "locus-logging-sentry",
        title: "Challenge 5 · 관측성 — bounds 경고와 Sentry 노이즈",
        tocLabel: "로그 · Sentry",
        problem: {
          body:
            "bounds 경고(초기 레이아웃 등)가 잦을 때 전부 Sentry로 보내면 비용·노이즈가 폭증합니다.",
        },
        approach: {
          body:
            "경고마다 `sendToSentry` 플래그로 제어하는 B안을 택해 운영 단계별로 잘라냈습니다.",
        },
        solution: {
          body:
            "`recordService` 등 bounds 검증 경로에서 빈번한 케이스는 경고만 남기고 Sentry 전송을 끕니다.",
          codeSnippet: {
            filename: "recordService.ts",
            language: "typescript",
            code: `function warnBounds(message: string, options?: { sendToSentry?: boolean }) {
  console.warn("[bounds]", message);
  if (options?.sendToSentry === false) return;
  sendToSentry("warning", { domain: "bounds", message });
}

if (!isValidBounds(bounds)) {
  warnBounds("invalid bounds on initial layout", { sendToSentry: false });
  return [];
}`,
          },
        },
        outcome: {
          body:
            "의미 있는 이슈에 쿼터를 남기면서도 재현 맥락은 로컬 로그로 확보합니다.",
        },
      },
    ],
    closing: {
      title: "결과 및 회고",
      body:
        "Lighthouse 55→71은 API 호출·메모리·초기 체감을 같이 다룬 뒤의 지표로 해석하는 것이 타당합니다. 패닝에서 격자 캐시 재사용, 장시간 기록 상한, 광역 줌 flush, SDK·첫 페인트 순서, 모바일 시트까지 한 제품 안에서 동시에 터지는 축이 많다는 걸 다시 확인했고, 고정 격자의 한계는 후속(쿼드트리 등)으로 남깁니다.",
    },
    wikiCard: {
      teaser: "boundsUtils · MapViewport · naverMapLoader 실제 경로는 projects.md 체크리스트에 정리되어 있습니다.",
      url: "#",
      linkLabel: "Wiki · 경로 맵",
    },
  },
  {
    id: 3,
    slug: "mint",
    title: "MINT (커스텀 스크립트 언어 인터프리터)",
    period: "2025.11",
    role: "개인 프로젝트 · CLI + 웹 플레이그라운드",
    description:
      "CLI와 Web에서 같은 언어를 실행하면서도 코어 재사용을 유지하기 위해 Lexer→Parser→Evaluator 단일 파이프라인과 stdout DI를 고정한 인터프리터입니다.",
    longDescription:
      "`runSource`로 tokenize·parse·evaluate를 한 경로에 묶고, 출력은 `options.stdout` 콜백으로만 전달했습니다. 실패는 `MintError`(origin, hint, location)로 정규화해 CLI 컬러링과 웹 하이라이트가 같은 에러 객체를 공유하도록 구성했습니다.",
    tags: ["인터프리터", "Lexer", "Parser", "DI", "TypeScript"],
    gradient: "from-sky-200 to-indigo-200",
    github: "#",
    live: "#",
    metrics: [
      { label: "코어", value: "L→P→E", hint: "단일 경로" },
      { label: "출력", value: "stdout DI", hint: "환경 무관" },
      { label: "에러", value: "origin · loc", hint: "공통 스키마" },
    ],
    challenges: [
      {
        id: "mint-pipeline",
        title: "Challenge 1 · 단일 파이프라인과 I/O 주입",
        tocLabel: "실행 파이프라인",
        problem: {
          body:
            "처음에는 CLI(`console`)와 Web(`UI`) 출력을 평가 로직 근처에서 직접 처리해도 되겠다고 봤지만, 환경 API가 코어에 스며들면 곧바로 중복 구현과 테스트 결합으로 이어졌습니다. 같은 언어를 두 플랫폼에서 돌리는데 로직을 두 번 관리해야 하는 상태가 문제였습니다.",
        },
        approach: {
          body:
            "선택지는 A) 플랫폼마다 평가기를 분리하거나, B) 실행 파이프라인은 하나로 두고 I/O만 외부에서 주입하는 구조였습니다. 유지보수 비용과 확장성을 기준으로 B를 선택했고, 출력은 `stdout` 콜백으로만 나가게 해 코어를 플랫폼 무관하게 유지했습니다.",
        },
        solution: {
          body:
            "`runSource(source, options)`에서 tokenize→parse→evaluate를 순서대로 실행하고, 성공 시 `{ ok: true, stdout }`, 실패 시 `toMintError`를 거친 `{ ok: false, error }`를 반환합니다. 평가기 내부는 `stdout` 콜백만 의존하므로 CLI/웹 어댑터는 외부에서 바뀌어도 코어 로직은 그대로 재사용됩니다.",
          codeSnippet: {
            filename: "mint/src/app/run/runner.ts",
            language: "typescript",
            code: `// 핵심: 환경 무관 실행 + 출력은 주입 콜백으로만
export function runSource(
  source: string,
  options: RunSourceOptions = {},
): RunResult {
  const context: MintErrorContext = { filePath: options.filename };
  try {
    const tokens = tokenize(source);
    const program = parse(tokens);
    const result = evaluateProgram(program, {
      stdout: (value) => options.stdout?.(value),
    });
    return { ok: true, stdout: result.stdout };
  } catch (error) {
    return { ok: false, error: toMintError(error, context) };
  }
}`,
          },
        },
        outcome: {
          body:
            "CLI와 Web이 동일한 실행/에러 분기를 공유해 동작 차이를 호스트 레이어로만 한정할 수 있었습니다. 이후 플랫폼이 늘어도 코어를 건드리지 않고 어댑터만 추가하는 확장 경로를 확보했습니다.",
        },
      },
      {
        id: "mint-errors",
        title: "Challenge 2 · 에러 스키마와 호스트 UI",
        tocLabel: "에러 규격",
        problem: {
          body:
            "단순 문자열 에러만 반환하면 CLI는 컬러 메시지, Web은 위치 하이라이트, 추후 IDE 연동까지 각각 파싱 규칙을 다시 써야 했습니다. 에러 출처와 위치 정보가 통일되지 않으면 디버깅 흐름이 플랫폼마다 어긋나는 문제가 있었습니다.",
        },
        approach: {
          body:
            "A) 플랫폼별 문자열 포맷을 유지하는 방식과 B) 공통 에러 객체를 표준화하는 방식 중, 확장성과 표현 일관성을 위해 B를 선택했습니다. Lexer/Parser/Evaluator 출처를 `origin`으로 고정하고 `hint`·`location`(line/column/lexeme)을 붙여 호스트가 같은 스키마를 소비하도록 정리했습니다.",
        },
        solution: {
          body:
            "`MintError`에 `message`, `origin`, `hint`, `location`을 구조화하고, 런타임 오류를 `toMintError`에서 일관된 형태로 변환했습니다. 결과적으로 CLI는 컬러/요약에 집중하고, Web은 위치 기반 하이라이트에 집중하는 식으로 표현 책임을 분리할 수 있었습니다.",
          codeSnippet: {
            filename: "mint/src/app/run/errors.ts",
            language: "typescript",
            code: `// mint/src/app/run/errors.ts — 플랫폼 공통 에러 표현
export class MintError extends Error {
  public readonly origin: MintErrorOrigin;
  public readonly hint?: string;
  public readonly location?: ErrorLocation;

  constructor(options: MintErrorOptions) {
    super(options.message);
    this.name = 'MintError';
    this.origin = options.origin;
    this.hint = options.hint;
    this.location = options.location;
  }
}`,
          },
        },
        outcome: {
          body:
            "에러 계약이 고정되면서 신규 호스트(TUI/IDE 확장)도 동일 객체를 재사용할 수 있는 기반이 생겼습니다. 복잡한 분기 로직을 각 플랫폼에 복제하지 않고, 코어 에러 스키마를 중심으로 확장할 수 있게 됐습니다.",
        },
      },
    ],
    closing: {
      title: "결과 및 회고",
      body:
        "환경 무관 실행과 출력 DI, 정규화된 에러로 ‘같은 코어·다른 표면’을 유지했습니다. 이후 호스트가 늘어도 경계 문서를 함께 두는 것이 중요합니다.",
    },
  },
  {
    id: 4,
    slug: "mini-git",
    title: "mini-git (Git 학습용 CLI)",
    period: "2025.03—2025.06",
    role: "개인 학습 프로젝트",
    description:
      "Git의 CAS·ref·스테이징을 최소 형태로 구현해, 커밋이 트리 스냅샷 노드라는 시간 모델을 코드로 따라가게 했습니다.",
    longDescription:
      "전략 맵으로 명령을 분리하고, loose object + zlib로 blob/tree/commit을 쓰며 ref만 갱신하는 append-only 흐름을 연습했습니다. packfile·merge·index v2는 범위에서 제외한 의도적 트레이드오프입니다.",
    tags: ["Git", "CLI", "CAS", "Node.js", "zlib"],
    gradient: "from-emerald-200 to-teal-200",
    github: "#",
    live: "#",
    metrics: [
      { label: "객체", value: "loose + zlib", hint: "SHA-1 취지" },
      { label: "스테이징", value: "JSON index", hint: "학습용 단순화" },
      { label: "명령", value: "Strategy", hint: "OCP" },
    ],
    challenges: [
      {
        id: "minigit-dispatch",
        title: "Challenge 1 · 명령 디스패치와 OCP",
        tocLabel: "Command 전략",
        problem: {
          body:
            "명령이 늘수록 진입점 if/else가 비대해지면 OCP가 깨지고 리그레션 범위가 불투명해집니다.",
        },
        approach: {
          body:
            "A(거대 switch) 대신 B(전략 맵 + `run(args, gitDir)`), C(플러그인 로더)는 학습 난이도를 고려해 제외했습니다.",
        },
        solution: {
          body:
            "`CommandStrategy[command]`로 구현체를 고르고 위임합니다. 잘못된 명령은 가드 후 종료해 학습용 베이스에서 안전하게 막습니다.",
        },
        outcome: {
          body:
            "명령 추가가 기존 진입점 분기 폭발 없이 모듈 등록으로 이어집니다.",
        },
      },
      {
        id: "minigit-storage",
        title: "Challenge 2 · 콘텐츠 주소 지정 저장소",
        tocLabel: "blob · tree",
        problem: {
          body:
            "파일 복사 스냅샷만 쓰면 중복·무결성 검증이 어렵고, ‘경로가 blob에 들어간다’는 오해가 남습니다.",
        },
        approach: {
          body:
            "B(loose object + `type size\\0` + SHA-1 + zlib)를 택하고, 스테이징은 C(실제 index 바이너리) 대신 JSON index로 ‘레이어 분리’만 유지했습니다.",
        },
        solution: {
          body:
            "`writeGitObject`로 헤더+본문을 해시하고 `objects/aa/...`에 zlib 저장합니다. `getObjectPath`로 Git과 같은 디렉터리 분산을 따릅니다.",
          codeSnippet: {
            filename: "mini-git/src/core/writeGitObject.js",
            language: "javascript",
            code: `function writeGitObject(type, content, gitDir) {
  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content, 'utf-8');
  const header = \`\${type} \${buffer.length}\\0\`;
  const store = Buffer.concat([Buffer.from(header, 'utf-8'), buffer]);

  const hash = crypto.createHash('sha1').update(store).digest('hex');
  const { objectDir, objectPath } = getObjectPath(gitDir, hash);
  if (!fs.existsSync(objectDir)) fs.mkdirSync(objectDir, { recursive: true });

  const compressed = zlib.deflateSync(store);
  fs.writeFileSync(objectPath, compressed);
  return hash;
}`,
          },
        },
        outcome: {
          body:
            "동일 내용은 동일 해시로 dedup 취지를 체득합니다. packfile·GC는 미구현인 한계를 명시합니다.",
        },
      },
      {
        id: "minigit-commit-flow",
        title: "Challenge 3 · add → tree → commit → ref",
        tocLabel: "커밋 흐름",
        problem: {
          body:
            "문서만 보면 커밋이 diff 묶음처럼 보이기 쉬운데, 실제로는 루트 tree 해시 + parent 링크가 커밋에 들어갑니다.",
        },
        approach: {
          body:
            "워킹 파일 → blob → index → tree → commit → ref 한 줄로만 상태를 옮기고, 객체는 append-only로 둡니다.",
        },
        solution: {
          body:
            "`add`에서 blob+index, `createTreeHash`에서 mode·filename·raw hash 엔트리로 tree, `commit`에서 tree·parent·메타를 본문으로 객체화 후 ref 파일을 한 줄 덮어씁니다.",
        },
        outcome: {
          body:
            "`init`/`add`/`commit`/`log`/`cat-file`로 **무엇이 불변이고 무엇이 가변인지**가 분리된다는 점을 코드로 확인할 수 있습니다.",
        },
      },
    ],
    closing: {
      title: "결과 및 회고",
      body:
        "JSON index·단순 parent 1개·HTTP 없음은 원리 검증용 트레이드오프입니다. 실제 Git의 packfile·rebase·merge·reflog는 범위 밖임을 스스로 명시합니다.",
    },
  },
  {
    id: 5,
    slug: "hanzawa-kanji",
    title: "hanzawa-kanji (일본 상용한자 학습)",
    period: "2025.03 – 2025.04",
    role: "API(Kotlin) + Web · 이력서 기간은 최종본 우선",
    description:
      "약 2,136자 규모 데이터셋에서 가입 없이 바로 학습을 시작할 수 있도록 설계하고, 커서 페이지네이션·prefetch·보기 풀 보충으로 무한 모드의 끊김을 줄인 프로젝트입니다.",
    longDescription:
      "서버는 `limit+1` 조회로 다음 커서 존재를 판별하고, 클라이언트는 남은 문항이 임계치 이하일 때 선제 prefetch를 수행합니다. 병합은 id 기준으로 중복 제거하며, 보기 풀은 일정 간격마다 보충해 장시간 무한 학습에서 후보 고갈을 늦췄습니다.",
    tags: ["Kotlin", "React", "커서", "Prefetch", "Quiz"],
    gradient: "from-amber-200 to-orange-200",
    github: "#",
    live: "#",
    metrics: [
      { label: "진입", value: "No-Auth", hint: "3초 내 학습 목표(이력서)" },
      { label: "API", value: "커서 + limit+1", hint: "순서 안정" },
      { label: "클라", value: "잔여 5 이하 prefetch", hint: "중복 제거" },
    ],
    challenges: [
      {
        id: "hanzawa-api",
        title: "Challenge 1 · 커서 페이지네이션과 limit+1",
        tocLabel: "서버 · 커서",
        problem: {
          body:
            "offset 페이지는 데이터 변경 시 일관성이 흔들리고, RANDOM 모드에서는 세션별 동일 순서가 필요합니다.",
        },
        approach: {
          body:
            "A(offset)와 B(cursor + limit+1) 중에서, 데이터 변경 상황에서도 순서를 안정적으로 유지할 수 있는 B를 선택했습니다. `hasMore` 판단 규칙을 서버 응답 계약으로 고정해 클라이언트 로직을 단순화했습니다.",
        },
        solution: {
          body:
            "서버는 `refinedLimit = limit + 1`로 한 건 더 받아 hasMore를 판별하고, 클라에는 `limit`만 반환합니다. quizId 시드 셔플 등은 draft·레포와 정합합니다.",
          codeSnippet: {
            filename: "KanjiService.kt",
            language: "kotlin",
            code: `val refinedLimit = limit + 1
val kanjiList = repository.list(
  limit = refinedLimit,
  quizId = dto.quizId,
  mode = mode,
  cursor = cursor,
)

return if (kanjiList.size == refinedLimit) {
  val lastOne = kanjiList.last()
  ListResponseDto(
    items = kanjiList.take(limit),
    cursor = lastOne.id,
    totalCount = totalCount,
  )
} else {
  ListResponseDto(kanjiList, cursor = null, totalCount = totalCount)
}`,
          },
        },
        outcome: {
          body:
            "세션별 문제 순서 일관성과 `hasMore` 판별 명확성을 동시에 확보했습니다. RANDOM 모드에서도 페이지 경계가 흔들리지 않는 형태로 운영할 수 있었습니다.",
        },
      },
      {
        id: "hanzawa-client",
        title: "Challenge 2 · 무한 모드 prefetch와 보기 풀",
        tocLabel: "클라 · Prefetch",
        problem: {
          body:
            "무한 퀴즈에서 매 클릭마다 로딩이 보이면 몰입이 끊깁니다. 문제 소진 때만 fetch하면 RTT가 UX를 자릅니다.",
        },
        approach: {
          body:
            "매번 fetch하는 방식 대신 `잔여 5문항 이하 prefetch`를 선택하고, 별도로 `답변 50문항마다 보기 풀 보충` 정책을 추가했습니다. 네트워크 대기와 보기 고갈을 같은 축에서 함께 제어하려는 의도였습니다.",
        },
        solution: {
          body:
            "클라는 `quizIndex >= length - 5`일 때 다음 묶음을 미리 가져오고, 병합 시 id로 중복을 제거합니다. `useQuizEngine`에서 답 누적이 일정 간격일 때 `ensureChoicePool`로 오답 후보를 보충합니다.",
          codeSnippet: {
            filename: "InfiniteMode.jsx",
            language: "javascript",
            code: `// 남은 슬롯 5 이하에서 prefetch
useEffect(() => {
  const shouldPrefetchMore =
    quizList.length > 0 && quizIndex >= quizList.length - 5;
  if (shouldPrefetchMore) fetchQuiz();
}, [quizIndex, quizList]);

// fetch 후 중복 제거 병합
setQuizList((prev) => {
  const existingIds = new Set(prev.map((item) => item.id));
  const newItems = data.items.filter((item) => !existingIds.has(item.id));
  return [...prev, ...shuffle(newItems)];
});`,
          },
        },
        outcome: {
          body:
            "접속 후 빠른 학습 진입(3초 목표)과 무한 모드 체감 지연 최소화(0ms 수준 목표)를 유지하는 방향으로 개선했습니다. 데이터 규모에 맞춰 prefetch 임계치와 보충 주기를 조절하는 운영 기준도 함께 남겼습니다.",
        },
      },
    ],
    closing: {
      title: "결과 및 회고",
      body:
        "데이터 규모에 맞춰 인메모리·prefetch 전략을 택한 사례를 이후 의사결정 레퍼런스로 남겼습니다.",
    },
  },
];
