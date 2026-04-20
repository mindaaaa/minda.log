export const SCENES = [
  {
    id: 1 as const,
    step: '01',
    label: 'ARCHITECT',
    labelKo: '설계',
    stepColor: 'rgba(124,111,247,0.9)',
    accent: '#7c6ff7',
    lines: [
      { text: '상황에 맞는' },
      { text: '선택을 설계하는' },
      {
        text: '개발자입니다.',
        gradient: 'linear-gradient(135deg,#5b21b6 0%,#7c3aed 40%,#a855f7 100%)',
      },
    ] as const,
    desc: 'React와 TypeScript를 사용해, 확장성과 단순함 사이에서 균형 잡힌 구조를 만드는 것을 중요하게 생각합니다.',
    bg: 'radial-gradient(ellipse 70% 60% at 72% 38%,rgba(196,181,253,0.22) 0%,transparent 70%)',
  },
  {
    id: 2 as const,
    step: '02',
    label: 'PERSPECTIVE',
    labelKo: '시야',
    stepColor: 'rgba(56,189,248,0.9)',
    accent: '#38bdf8',
    lines: [
      { text: '더 넓은 시야로' },
      {
        text: '문제를 바라봅니다.',
        gradient: 'linear-gradient(135deg,#1d4ed8 0%,#2563eb 40%,#3b82f6 100%)',
      },
    ] as const,
    desc: '프론트엔드 개발을 중심으로, 백엔드 영역까지 학습하며 더 넓은 시야로 문제를 바라보려 하고 있습니다.',
    bg: 'radial-gradient(ellipse 65% 55% at 28% 62%,rgba(186,230,255,0.2) 0%,transparent 68%)',
  },
  {
    id: 3 as const,
    step: '03',
    label: 'IMPROVE',
    labelKo: '개선',
    stepColor: 'rgba(52,211,153,0.9)',
    accent: '#34d399',
    lines: [
      { text: '불편을 개선하며' },
      {
        text: '발전합니다.',
        gradient: 'linear-gradient(135deg,#34d399 0%,#10b981 45%,#059669 100%)',
      },
    ] as const,
    desc: (
      <>
        여러 선택지를 비교하며 맥락에 맞는 결정을 고민하고,
        <br />
        경험에서 느낀 불편을 개선하며 더 나은 방향으로 발전해 나갑니다.
      </>
    ),
    bg: 'radial-gradient(ellipse 60% 55% at 65% 35%,rgba(167,243,208,0.22) 0%,transparent 68%)',
  },
];

export const TECH_CHIPS = [
  { label: 'React', bg: 'rgba(147,197,253,0.3)' },
  { label: 'TypeScript', bg: 'rgba(196,181,253,0.3)' },
  { label: 'TanStack Query', bg: 'rgba(167,243,208,0.3)' },
  { label: 'Zustand', bg: 'rgba(253,186,116,0.25)' },
  { label: 'PWA', bg: 'rgba(251,207,232,0.3)' },
  { label: 'Nest.js', bg: 'rgba(167,243,208,0.3)' },
];

export type Scene = (typeof SCENES)[number];
export type SceneId = Scene['id'];
