export const SOCIAL_LINKS = {
  github: "https://github.com/mindaaaa",
  tistory: "https://404minda.tistory.com/",
  resume: "",
  email: "avalc@naver.com",
} as const;

export interface SocialLinkItem {
  key: keyof typeof SOCIAL_LINKS;
  label: string;
  url: string;
  isEmail?: boolean;
}

export const SOCIAL_ITEMS: SocialLinkItem[] = [
  { key: "github", label: "GitHub", url: SOCIAL_LINKS.github },
  { key: "tistory", label: "Tistory", url: SOCIAL_LINKS.tistory },
  { key: "resume", label: "Resume", url: SOCIAL_LINKS.resume },
  { key: "email", label: "Email", url: SOCIAL_LINKS.email, isEmail: true },
];
