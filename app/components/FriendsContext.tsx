"use client";

import { FriendData } from "@/types/friend";
import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type FriendsContextType = {
  friendId: string;
  setFriendId: React.Dispatch<React.SetStateAction<string>>;
  friendData: FriendData | null;
  setFriendData: React.Dispatch<React.SetStateAction<FriendData | null>>;
  friendList: FriendData[];
  setFriendList: React.Dispatch<React.SetStateAction<FriendData[]>>;
};

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

function FriendsProvider({ children }: Props) {
  const [friendId, setFriendId] = useState<string>("");
  const [friendData, setFriendData] = useState<FriendData | null>(null);
  const [friendList, setFriendList] = useState<FriendData[]>([]);

  return (
    <FriendsContext.Provider
      value={{
        friendId,
        setFriendId,
        friendData,
        setFriendData,
        friendList,
        setFriendList,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}

function useFriends() {
  const context = useContext(FriendsContext);

  if (context === undefined)
    throw new Error(`useFriends must be used within a FriendsProvider`);
  return context;
}

export { FriendsProvider, useFriends };
