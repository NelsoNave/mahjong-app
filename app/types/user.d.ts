export type UserInfoCardProps = {
  label: string;
  value: string;
  actionText: string;
  d: string;
  onClick: () => void;
};

export type UserInfo = {
  id: string;
  username: string;
  language: string;
  email: string;
  profileImage: string;
};
