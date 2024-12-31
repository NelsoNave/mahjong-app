type Props = {
  friends: FriendData[];
};

import { FriendData } from "@/types/friend";
import FriendCardTest from "./FriendCardTest";

const FriendsList = ({ friends }: Props) => {
  return (
    <div>
      {friends.map((friend) => (
        <FriendCardTest
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
