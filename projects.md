# 엔지니어링 포트폴리오 요약

> **한 줄 포지셔닝** (이력서 PDF 기준): 시행착오를 반복하지 않기 위해, 문제를 자동화하고 지표로 남기는 개발자.

이 문서는 **시니어 개발자가 5분 안에 훑어볼 수 있도록**, 디렉터리에 포함된 프로젝트(JOKA, Locus, MINT, mini-git, hanzawa-kanji)를 **문제 → 선택지 → 결정 → 결과** 순으로 정리했습니다. 서술 근거는 [draft.md](draft.md)와 각 레포 코드, 이력서 PDF를 대조했으며, **구현이 아직 확인되지 않은 항목은 명시**했습니다.  
**JOKA**(§1)는 현재 워크스페이스 `joka/` 트리(모노레포·`apps/web`·`packages/*` 등)를 2026년 기준으로 한 번 더 대조해 두었습니다.

---

## 1. JOKA — 가족 중심 사진 아카이브 PWA

**기간·역할** · 2026.01 – 현재 · Co-founder & Frontend Lead (2인 팀, 프론트 리드)

### 1) 상황 및 문제 (Context & Problem)

- **현상**: PWA는 OS·브라우저·설치 모드 조합이 달라 동일 코드도 재현이 어려운 런타임 이슈가 나기 쉽고, 프로덕트 특성상 "누가 어느 환경에서 무엇을 했는지"가 비어 있으면 MTTI가 길어진다.
- **민감 데이터 가정**: 가족 사진/메타데이터이므로 일반 회원가입 모델보다 **접근 통제**가 더 중요하다.
- **제약**: 팀 규모가 작아 운영·보안·관측성을 한 번에 감당해야 하며, 과도한 로깅은 노이즈로 역행한다.
- **기술 맥락**: 루트는 **pnpm 워크스페이스 + Turborepo**(`turbo.json`, `packageManager: pnpm`). 웹 클라이언트(**`apps/web`**)는 이력서에 Next.js 등으로 적혀 있을 수 있으나, **본 저장소 기준 스택은 Vite 6 + React 19 + TypeScript**(`apps/web/package.json`). **Sentry(`@sentry/react`)·TanStack Query·전역 `ErrorBoundary`는 엔트리에서 이미 연동**되어 있음(아래 §3 참고). 백엔드/도메인 쪽은 **`packages/domain-media`**(앨범·미디어 도메인, Drizzle 기반 persistence, Jest 테스트)와 **`infra/cloudflare`**(Wrangler) 등으로 쪼개진 모노레포 구조.

### 2) 고민한 방안 (Options & Trade-off)

| 방안                                                | 장점                                    | 단점                                                 |
| --------------------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| **A. 클라이언트만 verbose 로깅**                    | 빠르게 도입                             | 서버·기기 컨텍스트 결합 어렵고, 노이즈·PII 유출 위험 |
| **B. 레벨+환경 분리(Console / Sentry)+Breadcrumbs** | 재현 맥락 확보, 운영 단계별 노이즈 조절 | 초기 설계·인프라 비용, 샘플링·마스킹 정책 필요       |
| **C. 공개 회원제 + 앱 내 역할만**                   | 구현 단순                               | 가족 단위 폐쇄성·오남용 방지에 불리                  |
| **D. OAuth 이후 Whitelist 2단 접근 제어**           | 미인가 주체를 서버에서 일관 차단        | 운영자의 화이트리스트 관리 절차 필요                 |

**선택**: **B + D** — Locus에서 겪은 "추적 불가"를 재발 방지 지표로 삼고, 비용 대비 신뢰가 필요한 도메인에 맞춤 (이력서·PDF·draft.md 정합).

### 3) 해결 및 구현 (Decision & Implementation)

- **관측성 (클라 — 코드 근거)**
  - **`initSentry`**: `apps/web/src/app/index.tsx`에서 1회 호출 → `apps/web/src/shared/lib/monitoring/sentry.ts`에서 `Sentry.init`, **`beforeSend`로 `applyBeforeSendFilter`** 연동. DSN은 `VITE_SENTRY_DSN`.
  - **노이즈·샘플링**: `sentry.policy.ts`에서 `layer` 태그별로 이벤트 **드롭/샘플링**(예: `expected` 전면 드롭, `business` 이중 샘플링, `operational`은 **허용 메시지 화이트리스트**만 통과). `joka-standard-event.ts`로 태그·컨텍스트 정규화, **`operationId` + `mediaState` 기반 fingerprint**로 이슈 그룹화.
  - **계층 로거**: `apps/web/src/shared/lib/logger/index.ts`의 `log.expected | business | operational | bug` — `business`는 `BUSINESS_SAMPLE_RATE`로 Sentry 보조 전송, `bug`는 `captureException` 등. `ErrorBoundary`(`apps/web/src/app/providers/error-boundary.tsx`)는 렌더 예외·**`unhandledrejection`** 을 `log.bug`로 넘김.
  - (이력서에 적은 Breadcrumbs·PWA display mode 등 **추가 컨텍스트**는 동일 방향으로 확장 가능하나, **현 파일 기준으로는 위 모듈에서 필수 필드 위주**로 정리된 상태.)

- **보안**: OAuth 통과 후에도 **Whitelist에 포함된 식별자만** 데이터 접근 — 인가 레이어를 애플리케이션만이 아니라 서버 정책으로 고정. (**본 워크스페이스에서 Whitelist 미들웨어 경로는 별도 확인·보강 권장.**)

- **UX / PWA**: Standalone + manifest 등 PWA 전제는 제품 방향과 정합. **`apps/web/vite.config.ts` 현재 스냅샷에는 PWA 플러그인이 없음** — 프로덕션 브랜치·별도 PR에서 `vite-plugin-pwa` 등을 붙였는지 이력서·배포본과 맞출 것.

- **프론트 구조**: `apps/web/src` 아래 **`app/`(엔트리·프로바이더·스타일), `entities/`, `features/`, `pages/`, `widgets/`, `shared/`** 로 화면·도메인 조각을 분리(FSD에 가까운 레이어링). 엔트리(`app/index.tsx`)는 **`QueryClientProvider` + `ErrorBoundary`** 기준으로 정리되어 있고, `app/providers/`에는 `router`, `theme-provider`, `auth-guard` 등도 두어 **라우팅·테마는 브랜치/진행 단계에 따라 엔트리에 붙는 정도가 달라질 수 있음**.

- **백엔드·도메인 (패키지)**: `packages/domain-media` — `domain/`(Media, Content, Thumbnail, ListMediaCondition 등), `service/media.service.ts`, `infrastructure/persistence/`(Drizzle 스키마·`MediaRepository`). 테스트는 `packages/domain-media/test/`. 객체·썸네일 등은 `packages/infra-object-storage`, `packages/infra-thumbnail` 등과 역할 분리.

- **모노레포 실행**: 루트 `pnpm` + `turbo run test|build` 태스크. Husky·lint-staged·`tsc --noEmit` 등은 **품질 게이트**로 레포 루트에 구성된 상태(브랜치별 상이할 수 있음).

```ts
// apps/web/src/shared/lib/logger/index.ts — 요지: 레이어별 Console vs Sentry
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
};
```

### 4) 결과 (Result)

- **정량**: 이력서 상 **기대 효과**로 MTTI 단축·운영 안정성 — **실측 수치는 프로덕션 관측 후 보강**이 필요함.
- **정성**: "이슈 발생 지점을 바로 찍을 수 있는 구조"를 최우선 가치로 두어, 이전 프로젝트의 시행착오를 **표준**으로 승격. **클라이언트에서는 Sentry `beforeSend`·레이어 태그·fingerprint·전역 ErrorBoundary로 그 방향의 뼈대가 코드로 고정됨.**
- **상태 라벨**: **관측성(웹)**: 부분 구현·확장 가능. **Whitelist·서버 인가·PWA 빌드 설정**: 이력서/제품 서술과 맞추려면 **배포 브랜치·API 레포**까지 포함해 재확인하는 것이 안전.

---

## 2. Locus — 공간 기반 기록 서비스

**기간·역할** · 2025.08 – 2026.02 · Frontend Lead (부스트캠프 그룹 프로젝트)

이력서/PDF에는 Locus 아래 **격자형 Bounds 캐싱, 메모리 거버넌스, rAF·SDK 로딩, (모바일) UX** 등 **여러 Technical Decision 블록**이 나란히 있다. 아래는 그 축을 모두 펼친 뒤, 코드 근거는 **실제 경로**로 맞춘 버전이다.

### 1) 상황 및 문제 (Context & Problem)

- **네트워크·비용**: 지도를 조금만 움직여도 bounds가 변해 API가 반복되면 **인프라 트래픽**과 깜빡임이 동시에 증가한다. 일반 CRUD와 달리 **이벤트 × 렌더링 × 상태**가 겹치는 도메인이다.
- **캐시 키 민감도**: 미세 패닝마다 queryKey가 달라지면 TanStack Query 캐시가 매번 미스 나 **사실상 캐시가 없는 것과 동일**해진다.
- **메모리·렌더링**: 확장 bounds로 미리 가져온 **전체 기록**을 모두 마커로 유지하면 맵 인스턴스·DOM/오버레이 부담으로 **저사양 기기에서 프리징**이 난다.
- **초기 로딩·메인 스레드**: Naver Maps SDK는 스크립트·초기화가 무겁고, 컨테이너 크기 0인 상태에서 붙이면 실패하거나 **화이트아웃**에 가깝게 보일 수 있다.
- **모바일 UX**: 한 손 조작·하단 시트 패턴이 없으면 지도 + 상세 + 생성 흐름이 **뷰포트 안에서 경쟁**한다.
- **관측성·노이즈**: bounds 경고(초기 레이아웃 등)가 잦으면 Sentry만 두면 비용·노이즈가 폭증한다.

### 2) 고민한 방안 (Options & Trade-off)

**네트워크 · 캐시**

| 방안                                                      | 장점                              | 단점                                    |
| --------------------------------------------------------- | --------------------------------- | --------------------------------------- |
| **A. pan/zoom마다 즉시 fetch**                            | 구현 단순                         | 요청 폭주, 비용·깜빡임                  |
| **B. 확장 bounds + 줌별 배수(1.5~3배)**                   | 드래그 한 번을 한 묶음으로 커버   | 배수·경계 재요청 조건 튜닝 필요         |
| **C. queryKey = 원시 bounds**                             | 지리적으로 정밀                   | 미세 이동마다 캐시 미스                 |
| **D. queryKey = 격자 반올림, 요청 payload = 원본 bounds** | 서버 정밀도 유지 + 클라 캐시 안정 | 팀원에게 "키와 요청이 다르다" 설명 필요 |

**선택**: **B + D** — `draft.md` PAR 1, [`boundsUtils.ts`](locus/apps/web/src/features/home/utils/boundsUtils.ts), [`useGetRecordsByBounds.ts`](locus/apps/web/src/features/record/hooks/useGetRecordsByBounds.ts).

**메모리 · 표시 데이터 분리**

| 방안                                                                      | 장점                                  | 단점                                      |
| ------------------------------------------------------------------------- | ------------------------------------- | ----------------------------------------- |
| **A. fetch된 전부를 항상 렌더**                                           | 구현 단순                             | 마커 수 폭주 시 메모리·프레임 붕괴        |
| **B. Map에 타임스탬프와 함께 누적 + 상한(예: 1000) + 오래된 것부터 제거** | 장시간 탐색에서도 상한이 있음         | LRU 정책·줌 아웃 시 전체 비우기 기준 필요 |
| **C. 줌 임계(예: 7 미만)에서 캐시 전체 flush**                            | 광역 뷰에서 불필요한 데이터 일괄 정리 | 탐색 깊이에 따라 다시 fetch 발생          |
| **D. 화면 bounds 안의 것만 `useMemo`로 derive ("visible")**               | 렌더 대상만 줄어듦                    | 전역 맵과 파생 배열 동기화 유지 필요      |

**선택**: **B + C + D** — [`MapViewport.tsx`](locus/apps/web/src/features/home/ui/MapViewport.tsx) (`allFetchedRecords` / `visibleApiRecords`).

**SDK 로딩 · 프레임**

| 방안                                                                   | 장점                                         | 단점                                |
| ---------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------- |
| **A. index.html에 스크립트 동기 태그**                                 | 빠른 PoC                                     | 파싱·실행이 메인 스레드를 오래 점유 |
| **B. 동적 삽입 + `loadingPromise` 싱글톤**                             | 중복 주입·레이스 방지                        | 로드 실패·타임아웃 처리 필요        |
| **C. 컨테이너 크기 0이면 `requestAnimationFrame`으로 재시도**          | 레이아웃 안 잡힌 상태에서 인스턴스 생성 방지 | 초기화 지연·조건 분기 증가          |
| **D. 최초 페인트 후 `rAF` + 짧은 `setTimeout`으로 로딩 오버레이 제거** | React 첫 프레임과 브라우저 페인트 정렬       | 타이밍 매직넘버 관리                |

**선택**: **B + C** ([`naverMapLoader.ts`](locus/apps/web/src/infra/map/naverMapLoader.ts), [`useMapInstance.ts`](locus/apps/web/src/shared/hooks/useMapInstance.ts)), **D**는 [`main.tsx`](locus/apps/web/src/main.tsx) 주석과 동일한 의도.

**모바일 · UX**

| 방안                                    | 장점               | 단점                          |
| --------------------------------------- | ------------------ | ----------------------------- |
| **A. 모든 상세를 별도 라우트 풀페이지** | 구현 익숙          | 지도 컨텍스트와 분리되기 쉬움 |
| **B. BottomSheet + 지도 위 오버레이**   | 한 손·지도 고정 UX | 시트·맵 이벤트 전파 제어 필요 |

**선택**: **B** — `MapViewport`의 `isBottomSheetOpen` 등 (이력서/PDF의 베이스 바텀시트 언급과 정합).

**로깅 · Sentry**

| 방안                                         | 장점                    | 단점                           |
| -------------------------------------------- | ----------------------- | ------------------------------ |
| **A. 모든 warn을 Sentry로**                  | 놓칠 것 없음            | 빈번한 경고로 쿼터·노이즈 폭발 |
| **B. 경고마다 `sendToSentry` 플래그로 제어** | 운영 단계별 노이즈 차단 | 정책 문서화 필요               |

**선택**: **B** — [`recordService.ts`](locus/apps/web/src/infra/api/services/recordService.ts) bounds 검증 경로.

### 3) 해결 및 구현 (Decision & Implementation)

#### 3-1. 격자 캐시 + TanStack Query (네트워크)

- **아이디어**: `0.01°`(≈1km) 격자로 bounds를 반올림해 **queryKey**를 안정화하고, API에는 **원본 bounds**를 넘긴다. 줌에 따라 `getExpansionFactor`로 **1.5~3배** 확장해 prefetch 범위를 조절한다.
- **복잡도**: 격자 계산 O(1), 캐시 lookup O(1); 동일 격자 패닝에서는 네트워크 생략.

```ts
// locus/apps/web/src/features/home/utils/boundsUtils.ts
const GRID_SIZE = 0.01;
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
```

```ts
// locus/apps/web/src/features/record/hooks/useGetRecordsByBounds.ts
const gridBounds = request ? roundBoundsToGrid({ ...request }) : null;

return useQuery({
  queryKey: ['records', 'bounds', gridBounds],
  queryFn: () => getRecordsByBounds(request!),
  staleTime: 300_000,
});
```

#### 3-2. 메모리 거버넌스 + 화면 내 레코드만 렌더 (런타임)

- **아이디어**: 서버/확장 영역에서 가져온 데이터는 `Map< id, { record, timestamp } >`로 들고, **화면 bounds**에 들어오는 것만 `visibleApiRecords`로 파생한다. 건수가 **1000**을 넘으면 타임스탬프 오름차순으로 잘라내고, **줌 7 미만**이면 광역 뷰로 보고 **전체 비운다** (draft.md PAR 2와 동일 정책).
- **복잡도**: 정리 시 정렬 O(N log N), N은 상한에 가깝게 묶임.

```tsx
// locus/apps/web/src/features/home/ui/MapViewport.tsx (요지)
useEffect(() => {
  const MAX_RECORDS = 1000;
  const LOW_ZOOM_THRESHOLD = 7;

  setAllFetchedRecords((prev) => {
    if (currentZoom < LOW_ZOOM_THRESHOLD) return new Map();
    if (prev.size > MAX_RECORDS) {
      const sorted = Array.from(prev.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );
      return new Map(sorted.slice(-MAX_RECORDS));
    }
    return prev;
  });
}, [currentZoom]);

const visibleApiRecords = useMemo(() => {
  if (!currentViewBounds || allFetchedRecords.size === 0) return [];
  const visible: ApiRecord[] = [];
  allFetchedRecords.forEach(({ record }) => {
    if (
      isWithinBounds(
        record.location.latitude,
        record.location.longitude,
        currentViewBounds,
      )
    )
      visible.push(record);
  });
  return visible;
}, [currentViewBounds, allFetchedRecords]);
```

#### 3-3. SDK 동적 로딩 · 싱글톤 · 컨테이너 rAF

- **아이디어**: 스크립트 삽입은 **`loadingPromise` 싱글톤**으로 한 번만 진행. 맵 인스턴스는 컨테이너 `offsetWidth/Height`가 0이면 **`requestAnimationFrame` 폴링**으로 다음 프레임까지 대기한 뒤 생성.

```ts
// locus/apps/web/src/infra/map/naverMapLoader.ts — 중복 로드 방지
let loadingPromise: Promise<boolean> | null = null;

export function loadNaverMapScript({
  clientId,
}: NaverMapLoaderOptions): Promise<boolean> {
  if (isNaverMapLoaded()) return Promise.resolve(true);
  if (loadingPromise) return loadingPromise;
  const promise = new Promise<boolean>(/* script 삽입 ... */).finally(() => {
    loadingPromise = null;
  });
  loadingPromise = promise;
  return promise;
}
```

```ts
// locus/apps/web/src/shared/hooks/useMapInstance.ts — 레이아웃 준비까지 rAF
const waitForContainerSize = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const check = () => {
      const container = mapContainerRef.current;
      if (!container || mapInstanceRef.current) return resolve(false);
      if (container.offsetWidth > 0 && container.offsetHeight > 0)
        resolve(true);
      else requestAnimationFrame(check);
    };
    check();
  });
};
```

- **초기 로딩 화면**: React 마운트 직후 **`requestAnimationFrame` → 짧은 `setTimeout`**으로 스플래시를 걷어 화이트 스크린 체감을 줄임 (`main.tsx` 주석과 동일 취지).

#### 3-4. 모바일 상호작용

- 지도 위 **BottomSheet**·핀 선택·연결선 표시 여부를 state로 나누어, **지도 탐색**과 **기록 상세**가 같은 화면에서 경쟁하지 않도록 함 (`MapViewport`의 `isBottomSheetOpen`, 연결선 토글 등).

#### 3-5. 관측성 · 노이즈

- bounds가 무효에 가까울 때는 **경고 로그만** 남기고 `sendToSentry: false`로 **빈번한 케이스를 Sentry에서 제외** ([`recordService.ts`](locus/apps/web/src/infra/api/services/recordService.ts)).

### 4) 결과 (Result)

- **정량**: Lighthouse **55 → 71** (이력서·draft·PDF). API 호출 빈도·메모리 상한·초기 로딩 체감을 동시에 다룬 뒤 나온 수치로 해석하는 것이 타당하다.
- **정성**: 패닝 구간에서 **같은 격자 캐시 재사용**, 장시간 사용 시에도 **기록 개수 상한**, 광역 줌에서 **flush**로 런타임 안정성 확보. SDK·컨테이너·첫 페인트 순서를 정리해 **프리징·화이트아웃** 완화. 모바일은 바텀시트로 흐름 정리.
- **한계(정직하게)**: 고정 격자는 줌별 밀도 차이를 완벽히 반영하지 못한다 — draft.md에 적은 대로 **쿼드트리 등**은 후속 검토 안건.

---

## 3. MINT — 커스텀 스크립트 언어 인터프리터

**기간·역할** · 2025.11 · 개인 프로젝트 (CLI + 웹 플레이그라운드)

### 1) 상황 및 문제 (Context & Problem)

- **현상**: 동일 언어를 CLI(파일·stdio)와 웹(터미널 UI)에서 실행하려다 보면 **코어와 I/O가 섞여** 분기가 늘어난다.
- **원인**: 환경 API(`fs`, `window` 등)가 평가기에 스며들면 이식성·테스트가 무너지고, 출력·에러 표현이 플랫폼마다 달라진다.

### 2) 고민한 방안 (Options & Trade-off)

| 방안                                             | 장점                       | 단점                             |
| ------------------------------------------------ | -------------------------- | -------------------------------- |
| **A. CLI용 / Web용 평가기 복제**                 | 각각 최적 UI 가능          | 로직 드리프트, 버그 2배          |
| **B. 단일 `runSource` + Lexer→Parser→Evaluator** | 단일 진실 공급원           | 경계 설계·에러 스키마 필요       |
| **C. Core가 console.log 직접 호출**              | 디버깅 편할 수 있음        | 호스트 교체·테스트 어려움        |
| **D. stdout 등을 옵션으로 주입(DI)**             | CLI/웹 출력 전략 교체 용이 | 호출 규약을 엄격히 문서화해야 함 |

**선택**: **B + D**.

### 3) 해결 및 구현 (Decision & Implementation)

- **구조**: `tokenize → parse → evaluate`는 순수 문자열/AST 기반; 출력은 **`options.stdout`** 콜백으로만 나간다.
- **결과 타입**: 성공(`ok: true` + stdout 배열) / 실패(`ok: false` + 정규화된 에러)로 웹·CLI가 **동일 분기**를 탄다.
- **에러 스키마**: Lexer/Parser/Evaluator 출처를 **`origin`**으로 남기고, **`hint` / `location`(라인·lexeme)** 를 붙여 호스트가 CLI 컬러링 vs 웹 하이라이트를 **같은 객체**로 처리할 수 있게 함 ([`mint/src/app/run/errors.ts`](mint/src/app/run/errors.ts)).

```ts
// 핵심: 환경 무관 실행 + 출력은 주입 콜백으로만
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
}
```

```ts
// mint/src/app/run/errors.ts — 플랫폼 공통 에러 표현
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
}
```

### 4) 결과 (Result)

- **정량**: "코어 100% 재사용"은 아키텍처 목표 문구(이력서/draft) — **라인 커버리지 수치는 별도 측정 없음**.
- **정성**: 신규 호스트(IDE 플러그인 등)는 어댑터만 추가하는 확장 스토리가 성립; 에러 Type/Message/Location 규격화로 UI 하이라이트 근거가 생김.

---

## 4. mini-git — Git 학습용 CLI

**기간·역할** · 2025.03 – 2025.06 · 개인 학습 프로젝트

실제 **Git**은 (1) **콘텐츠 주소 지정 저장소** — 객체(blob/tree/commit)는 내용의 해시로 식별되고 한 번 쓰이면 **덮어쓰지 않으며**, (2) **브랜치(ref)** 는 “어느 커밋을 가리키는지”만 바꾸는 **가변 포인터**, (3) **스테이징 영역(index)** 이 있어 워킹 트리와 다음 커밋 스냅샷을 분리한다. mini-git은 이 세 층을 최소 형태로 구현해, “왜 커밋이 diff 묶음이 아니라 **트리 스냅샷**인지”를 코드로 따라가게 만든다.

### 1) 상황 및 문제 (Context & Problem)

- **CLI 구조**: 명령이 늘수록 진입점 `if/else`가 비대해지면 **개방-폐쇄 원칙(OCP)** 이 깨지고 리그레션 범위가 불투명해진다.
- **모델 이해**: 문서만 읽으면 “커밋 = 변경 요약”으로 오해하기 쉬운데, 실제로는 **루트 tree 해시 + (있다면) parent 커밋 해시**가 커밋 객체에 들어가고, **파일 이름·권한 모드**는 **tree 엔트리**에만 존재한다.
- **데이터 무결성**: 워킹 디렉터리 파일은 언제든 망가질 수 있어, **객체 저장소**를 append-only로 두고 상태 전이를 “새 객체 + ref 이동”으로만 표현하면 역사가 **불변 체인**으로 남는다.
- **학습 범위**: packfile, merge, index v2 바이너리 등은 의도적으로 생략하고, **loose object + zlib** 수준에서 원리를 담보한다.

### 2) 고민한 방안 (Options & Trade-off)

**명령 디스패치**

| 방안                                 | 장점                            | 단점                                           |
| ------------------------------------ | ------------------------------- | ---------------------------------------------- |
| **A. 거대 switch/if**                | 빠른 PoC                        | 확장·테스트·코드 리뷰 비용                     |
| **B. 전략 맵 + `run(args, gitDir)`** | 명령별 모듈 분리, 진입점 단일화 | 맵 등록 누락 시 런타임 에러 (규약·리뷰로 보완) |
| **C. 플러그인 로더**                 | 확장성 극대                     | 학습·디버깅 난이도 상승                        |

**선택**: **B** — [`CommandStrategy.js`](mini-git/src/strategies/CommandStrategy.js), [`index.js`](mini-git/src/index.js).

**저장소 표현 (진짜 Git과의 거리)**

| 방안                                                                                                     | 장점                                                              | 단점                                  |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| **A. 파일 복사 스냅샷만**                                                                                | 직관적                                                            | 중복 저장, dedup·무결성 검증 어려움   |
| **B. loose object + `type size\\0` 헤더 + SHA-1 + zlib** (Git과 동일한 **한 커밋당 객체 레이아웃** 취지) | 동일 내용은 동일 해시(중복 방지), `cat-file` 사고방식 그대로 적용 | packfile 압축·GC는 미구현             |
| **C. 실제 Git index 바이너리**                                                                           | 완전 호환                                                         | 파싱/직렬화 부담으로 학습 목적 흐려짐 |

**선택**: **B** + 스테이징은 **JSON index**로 단순화 ([`addFileToIndex.js`](mini-git/src/core/addFileToIndex.js)) — “스테이징이 별도 레이어라는 사실”만 유지.

### 3) 해결 및 구현 (Decision & Implementation)

#### 3-1. 전략 패턴으로 명령 확장

```js
// mini-git/src/index.js — 의도: 문자열만으로 구현체 선택 후 위임
const strategy = CommandStrategy[command];
if (!strategy) {
  console.error(`mini-git: '${command}'은(는) 깃 명령이 아닙니다.`);
  process.exit(1); // 학습용 베이스에는 조기 종료가 안전
}
strategy.run(args, gitDir);
```

(저장소 원본은 `process.exit` 없이 `strategy.run`을 호출할 수 있어 **잘못된 명령에서 런타임 예외**가 날 수 있다. 포트폴리오·실서비스 관점에서는 위처럼 **가드 후 종료**가 맞다.)

#### 3-2. Git 객체 한 건을 파일로 쓰기 (content-addressable 핵심)

Git은 저장 시 **`헤더(타입 + 공백 + 바이트 길이 + \\0)`와 본문을 이어 붙인 blob 전체**에 대해 해시를 낸다. 같은 파일 내용이면 **항상 같은 blob 해시**가 나오고, 파일 경로는 이때까지 **blob에 들어가지 않는다**.

```js
// mini-git/src/core/writeGitObject.js
function writeGitObject(type, content, gitDir) {
  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content, 'utf-8');
  const header = `${type} ${buffer.length}\0`;
  const store = Buffer.concat([Buffer.from(header, 'utf-8'), buffer]);

  const hash = crypto.createHash('sha1').update(store).digest('hex');
  const { objectDir, objectPath } = getObjectPath(gitDir, hash); // objects/aa/bcde...
  if (!fs.existsSync(objectDir)) fs.mkdirSync(objectDir, { recursive: true });

  const compressed = zlib.deflateSync(store);
  fs.writeFileSync(objectPath, compressed);
  return hash;
}
```

- **`getObjectPath`**: 해시 앞 2자를 디렉터리로 쓰는 **Git loose object 레이아웃**과 동일한 분산 방식 ([`getObjectPath.js`](mini-git/src/utils/path/getObjectPath.js), [`splitHash.js`](mini-git/src/utils/splitHash.js)).

#### 3-3. `add` → blob + index (스테이징)

```js
// mini-git/src/commands/add.js — 워킹 트리 → blob 객체 → index(파일명→해시)
const content = fs.readFileSync(filePath, 'utf-8');
const hash = createBlobObject(content, gitDir); // writeGitObject('blob', ...)
addFileToIndex(filename, hash, gitDir);
```

#### 3-4. `commit` → tree 객체 → commit 객체 → ref 갱신 (역사의 끝을 옮김)

1. index의 `filename → blobHash` 맵으로 **tree 바이너리**를 만들고 `writeGitObject('tree', ...)`로 tree 해시를 얻는다.
2. **commit** 문자열 본문에는 **루트 `tree`**, (있으면) **`parent`**, 작성자·메시지가 들어간다.
3. 새 commit 해시를 계산해 **현재 브랜치 ref 파일**에 한 줄로 덮어쓴다 — **객체는 append-only**, **바뀌는 것은 포인터**뿐이다.

```js
// mini-git/src/core/createTreeHash.js — tree: mode name\\0 + 20바이트 raw hash 반복
const fileEntries = Object.entries(index).map(([filename, hash]) => {
  const entry = `100644 ${filename}\0`;
  const hashBuffer = Buffer.from(hash, 'hex');
  return Buffer.concat([Buffer.from(entry), hashBuffer]);
});
return writeGitObject('tree', Buffer.concat(fileEntries), gitDir);
```

```js
// mini-git/src/commands/commit.js — 스냅샷 고정 + 부모 링크 + ref 이동
const treeHash = createTreeHash(index, gitDir);
const parent = fs.existsSync(branchPath)
  ? fs.readFileSync(branchPath, 'utf-8').trim()
  : null;

const commitContent = `tree ${treeHash}
${parent ? `parent ${parent}\n` : ''}
author ${author}
committer ${timestamp}

${message}
`;
const commitHash = writeGitObject('commit', commitContent, gitDir);
fs.writeFileSync(branchPath, commitHash);
```

**복잡도**: blob/tree/commit 각각 해시 계산은 본문 길이에 선형 O(n). 동일 내용 재-add는 **동일 blob 해시**로 **추가 저장 없이** index만 갱신될 수 있어(이미 존재하면 덮어쓰기지만 내용 동일) **저장소 중복은 자연스럽게 억제**된다.

### 4) 결과 (Result)

- **정량**: 학습용 CLI라 벤치 수치는 없음.
- **정성**: `init`/`add`/`commit`/`log`/`cat-file` 흐름으로 **“커밋이 트리 DAG 위의 노드”**라는 Git 본체의 시간 모델을 직접 추적할 수 있다. 실제 Git은 **packfile·rebase·merge·reflog** 등이 더 있지만, **loose object + ref 갱신**만으로도 분산 협업 시 **무엇이 불변이고 무엇이 가변인지**가 분리된다는 점을 체득한다.
- **한계(스스로 명시)**: JSON index, 단순한 parent 1개만, HTTP/서버 없음 — **원리 검증용**으로 의도된 트레이드오프.

---

## 5. hanzawa-kanji — 일본 상용한자 학습 (API + Web)

**기간·역할** · 2025.03 – 2025.04 (이력서 PDF는 2025.03–2026.04로 표기된 구간 있음 — **정확 기간은 이력서 최종본 우선**)

### 1) 상황 및 문제 (Context & Problem)

- **현상**: 가입·동기화가 느리면 온보딩 이탈; 무한 퀴즈에서 매 클릭마다 로딩이 뜨면 **몰입이 끊김**.
- **원인**: offset 페이지네이션은 중간 삽입 시 순서가 흔들릴 수 있음; RANDOM 모드에서는 **세션별 동일 순서**가 요구됨.
- **제약**: 상용한자 **약 2,136자**로 데이터셋이 닫혀 있어 전략 선택 여지가 있다.

### 2) 고민한 방안 (Options & Trade-off)

| 방안                                     | 장점                         | 단점                              |
| ---------------------------------------- | ---------------------------- | --------------------------------- |
| **A. offset 기반 페이지**                | 단순                         | 데이터 변경 시 페이지 일관성 붕괴 |
| **B. 커서(다음 시작 id) + limit+1 조회** | 순서 안정, hasMore 판단 쉬움 | API·클라 계약 명확히 필요         |
| **C. 문제 소진 때마다만 fetch**          | 구현 단순                    | 네트워크 라운드트립이 UX를 자름   |
| **D. 잔여 N문항 이하에서 prefetch**      | 체감 0에 가깝게 유지         | 중복 제거·커서 상태 관리 필요     |

**선택**: **B + D** (+ 서버에서 quizId 시드 셔플은 draft.md·repository 정합).

### 3) 해결 및 구현 (Decision & Implementation)

**서버**: `limit+1`로 한 건 더 받아 **다음 커서**를 만들고, 클라에는 `limit`만 반환.

```kotlin
// 핵심: N+1 조회로 다음 커서 존재 여부 판별
val refinedLimit = limit + 1
val kanjiList = repository.list(limit = refinedLimit, quizId = dto.quizId, mode = mode, cursor = cursor)

return if (kanjiList.size == refinedLimit) {
    val lastOne = kanjiList.last()
    ListResponseDto(items = kanjiList.take(limit), cursor = lastOne.id, totalCount = totalCount)
} else {
    ListResponseDto(kanjiList, cursor = null, totalCount = totalCount)
}
```

**클라이언트 (무한 모드)**: 남은 문항이 **5개 이하**일 때 다음 묶음을 미리 가져옴; 리스트 병합 시 **id 기준 중복 제거**.

```js
// 핵심: 남은 슬롯 5 이하에서 prefetch → 체감 로딩 최소화
useEffect(() => {
  const shouldPrefetchMore =
    quizList.length > 0 && quizIndex >= quizList.length - 5;
  if (shouldPrefetchMore) fetchQuiz();
}, [quizIndex, quizList]);
```

```js
// fetch 후 중복 제거 병합 (동일 문항 재노출 방지)
setQuizList((prev) => {
  const existingIds = new Set(prev.map((item) => item.id));
  const newItems = data.items.filter((item) => !existingIds.has(item.id));
  return [...prev, ...shuffle(newItems)];
});
```

- **보기(choice) 풀**: 4지선다용 오답 후보는 별도 풀에서 `ensureChoicePool`로 보충하고, 답한 문항 수가 **일정 간격**(예: 50문항, `Choice.REPLENISH_INTERVAL`)마다 풀을 다시 채워 무한 모드에서 보기 고갈을 늦춘다 ([`useQuizEngine.js`](hanzawa-kanji-web/src/shared/hooks/useQuizEngine.js)).

```js
// 답변 누적이 REPLENISH_INTERVAL 배수일 때 보기 풀 보충
useEffect(() => {
  const shouldRefetchPool =
    answeredCount > 0 && answeredCount % Choice.REPLENISH_INTERVAL === 0;
  if (shouldRefetchPool && !loading) {
    ensureChoicePool(Choice.INITIAL_SIZE);
  }
}, [answeredCount, loading, choicePool]);
```

### 4) 결과 (Result)

- **정량**: 이력서/draft 기준 **접속 후 3초 이내 학습 진입**, 무한 모드에서 **체감 지연 최소화(0ms 수준 목표)** — 실제 RTT·디바이스별 스냅샷은 선택적으로 부가.
- **정성**: 가입 없이 세션 시작, 수백 문항 연속에서도 끊김 완화; "데이터 규모에 따라 인메모리·prefetch 전략이 달라짐"을 이후 프로젝트 의사결정 레퍼런스로 축적.

---

## 문서 끝 — 대조 체크리스트

| 항목                                           | 소스                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Locus Lighthouse 55→71                         | draft.md, PDF, 이력서 정합                                                                                                |
| Locus 격자·확장 bounds·Query key               | `locus/apps/web/.../boundsUtils.ts`, `useGetRecordsByBounds.ts`                                                           |
| Locus 메모리 1000·줌 7·visible 파생            | `locus/apps/web/.../MapViewport.tsx`                                                                                      |
| Locus SDK 싱글톤·컨테이너 rAF                  | `naverMapLoader.ts`, `useMapInstance.ts`, `main.tsx`                                                                      |
| Locus 로그 노이즈·sendToSentry                 | `recordService.ts`                                                                                                        |
| JOKA Sentry·beforeSend·계층 로거·ErrorBoundary | `apps/web/src/shared/lib/monitoring/sentry.ts`, `sentry.policy.ts`, `logger/index.ts`, `app/providers/error-boundary.tsx` |
| JOKA 웹 스택·Query                             | `apps/web/package.json`(Vite 6, React 19, `@tanstack/react-query`, `@sentry/react`), `app/index.tsx`                      |
| JOKA 도메인·테스트                             | `packages/domain-media/src/domain`, `service`, `infrastructure`; `packages/domain-media/test/`                            |
| JOKA 모노레포·인프라                           | 루트 `package.json`·`turbo.json`, `infra/cloudflare/package.json`                                                         |
| JOKA Whitelist·OAuth·PWA manifest              | PDF / draft.md — **서버·별도 브랜치에서 구현 여부 재확인**                                                                |
| MINT `runSource`·`MintError`                   | `mint/.../runner.ts`, `errors.ts`                                                                                         |
| mini-git 전략·객체·커밋                        | `index.js`, `CommandStrategy.js`, `writeGitObject.js`, `createTreeHash.js`, `commands/add.js`, `commands/commit.js`       |
| hanzawa 커서·prefetch                          | `KanjiService.kt`, `InfiniteMode.jsx`, `useQuizEngine.js`                                                                 |
