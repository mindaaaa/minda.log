# Portfolio Project

## 프로젝트 개요

개인 개발자 포트폴리오 웹사이트.
About / Projects / Activities 3개 섹션으로 구성.

## 기술 스택

## 디자인 시스템

- 글라스모피즘 기반 UI
- 반응형 지원 예정 (모바일 포함)

## 섹션별 구조

### About

- 3페이지 구성, 세로 스크롤로 전환
- 패럴랙스 레이어 효과 (배경 + 에셋 PNG + 텍스트 레이어)
- 마우스 추적 인터랙션 (약하게)
- 에셋 위치: src/assets/about/

### Projects

- 벤토그리드 레이아웃
- 메인 프로젝트 카드 (대형) + 서브 카드 구성
- 카드에 대표 이미지/썸네일 포함
- 카드 클릭 시 상세페이지로 이동 (Framer Motion layoutId 전환)

### Activities

- 카드 스택 + 우측 상세 구조
- 6장의 카드가 색상별로 비스듬하게 겹쳐 쌓임
- 카드 hover/클릭 시 우측으로 살짝 이동 + 화살표 표시
- 우측 영역에 배움 목록 및 핵심 인사이트 표시
- 총 6개 활동 항목

## 미디어 에셋

- 이미지: src/assets/images/
- 패럴랙스 PNG 에셋: src/assets/about/
- 시연 영상: src/assets/videos/ (WebM 포맷)
- 영상은 카드 썸네일 X, 상세페이지에서만 사용

## 주요 컨벤션

- 컴포넌트 파일명: PascalCase
- 훅 파일명: camelCase (use 접두사)
- 스타일: CSS Modules or Tailwind (프로젝트 확인 후 기재)
- 코드 스타일: Airbnb 스타일 가이드 기준

## 코드 규칙

- if문은 한 줄이어도 반드시 중괄호 사용

```ts
// ❌
if (isLoading) return null;

// ✅
if (isLoading) {
  return null;
}
```

- any 타입 사용 금지, unknown 또는 명시적 타입 사용

- 복잡한 조건문은 의미있는 변수명으로 분리

```ts
  // ❌
  if (!isLoading && !isError && data.length > 0) { ... }

  // ✅
  const hasData = !isLoading && !isError && data.length > 0;
  if (hasData) { ... }
```

- 매직넘버는 상수로 선언

```ts
// ❌
setTimeout(() => {}, 3000);

// ✅
const ANIMATION_DELAY_MS = 3000;
setTimeout(() => {}, ANIMATION_DELAY_MS);
```

## 커밋 메시지

형식:

```text
타입: 제목 (한글)

변경 내용 구체화 1
변경 내용 구체화 2
```

타입 목록:

```text
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `style`: 스타일 수정
- `chore`: 설정, 패키지 등 기타
```

예시:

```text
feat: Activities 섹션 플립 카드 애니메이션 추가

- 중앙 카드 클릭 시 앞뒤 플립 전환 구현
- 뒷면에 배움 항목 및 핵심 인사이트 표시
- backdrop-filter 충돌 방지를 위해 앞뒤 면 별도 div로 분리
```

```text
fix: iOS Safari 시연 영상 자동재생 안 되는 문제 수정

- video 태그에 muted, playsInline 속성 누락되어 있던 것 추가
```

```text
refactor: 프로젝트 카드 조건문 가독성 개선

- isLoading, isError, hasData 조건을 변수로 분리
- 매직넘버 CARD_ANIMATION_DURATION_MS 상수로 추출
```

## 작업 시 주의사항

- 렌더링 성능이 최우선. 렌더링에 영향을 줄 수 있는 변경은 작업 전 보고 후 대안 제시
- backdrop-filter와 3D transform 동시 사용 시 blur 깨짐 현상 발생 가능. 해당 조합 사용 전 보고 후 대안 제시
- iOS Safari autoplay 대응: video 태그에 muted + playsInline 필수
- Framer Motion layoutId 전환은 같은 페이지 내 컴포넌트 구조에서만 동작. 라우터 구조 변경 시 주의
