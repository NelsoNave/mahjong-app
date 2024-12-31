export type UserInfoCardProps = {
  label: string;
  value: string;
  actionText: string;
  d: string;
  onClick: () => void;
};

export type SupportedLanguage = 'ja' | 'en';
export type DisplayLanguage = '日本語' | 'English';

export type UserInfo = {
  id: string;
  userName: string;
  language: DisplayLanguage;
  email: string;
  image: string;
  backgroundImage: string;
  subscriptionPlan: string;
};
