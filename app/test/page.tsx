import { getAllFriendData } from "@/actions/friendActions";
import { getUserInfo } from "@/actions/userActions";
import FriendsList from "@/components/FriendsList";
import { UserInfo } from "@/types/user";

const page = async () => {
  const data = await getAllFriendData();
  const currentUser: ActionState<UserInfo> = await getUserInfo();

  if (!currentUser || !currentUser.data) {
    return null;
  }

  const currentUserId = Number(currentUser.data.id);

  const friends = data.items;
  if (!friends || friends.length === 0) {
    return null;
  }

  // 承知待ち
  const waitingFriends = friends.filter(
    (friend) => friend.status === "PENDING" && friend.id === currentUserId,
  );

  // 申請中
  const pendingFriends = friends.filter(
    (friend) => friend.status === "PENDING" && friend.id !== currentUserId,
  );

  // 友達
  const acceptedFriend = friends.filter(
    (friend) => friend.status === "ACCEPTED",
  );

  return (
    <>
      <p>承認待ち</p>
      <FriendsList friends={waitingFriends} />
      <p>申請中</p>
      <FriendsList friends={pendingFriends} />
      <p>友達</p>
      <FriendsList friends={acceptedFriend} />
    </>
  );
};

export default page;
