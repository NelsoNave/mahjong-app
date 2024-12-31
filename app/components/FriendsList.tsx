type Props = {
  friends: FriendData[];
};

import { FriendData } from "@/types/friend";
import FriendCard from "./FriendCard";

const FriendsList = ({ friends }: Props) => {
  return (
    <div>
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          id={friend.id}
          friendName={friend.friendName}
          image={friend.image}
          status={friend.status}
        />
      ))}
    </div>
  );
};

export default FriendsList;
