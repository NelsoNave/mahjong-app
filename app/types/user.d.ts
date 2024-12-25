export type UserInfoCardProps = {
  label: string;
  value: string;
  actionText: string;
  d: string;
  onClick: () => void;
};

export type SupportedLanguage = 'ja' | 'en';

export type UserInfo = {
  id: string;
  userName: string;
  language: SupportedLanguage;
  email: string;
  image: string;
  backgroundImage: string;
};
