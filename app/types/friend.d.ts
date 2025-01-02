import { UserInfo } from "./user";

export type FriendData = {
  id: number;
  friendName: string;
  status?: string;
  image: string;
  isSelfRequester?: boolean;
  isFriendRequester?: boolean;
  user?: Pick<UserInfo, "id" | "userName" | "image">;
};
