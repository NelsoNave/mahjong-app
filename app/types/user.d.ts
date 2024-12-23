export type UserInfoCardProps = {
  label: string;
  value: string;
  actionText: string;
  d: string;
  onClick: () => void;
};

export type UserInfo = {
  id: string;
  userName: string;
  language: string;
  email: string;
  image: string;
  backgroundImage: string;
};
