import { getUserInfo } from "@/actions/userActions";
import FriendsList from "@/components/FriendsList";
import FriendsSearchForm from "@/components/FriendsSearchForm";

import { getAllFriendData } from "@/actions/friendActions";
import Header from "@/components/Header";
import { UserInfo } from "@/types/user";
import Image from "next/image";
import { FriendsProvider } from "@/components/FriendsContext";

const Page = async () => {
  const data = await getAllFriendData();
  const currentUser: ActionState<UserInfo> = await getUserInfo();

  if (!currentUser || !currentUser.data) {
    return null;
  }

  const currentUserId = Number(currentUser.data.id);

  const friends = data.items || [];
  const hasFriends = friends && friends.length > 0;

  // 承知待ち
  const waitingFriends = friends
    .filter(
      (friend) => friend.status === "PENDING" && friend.id === currentUserId,
    )
    .map((friend) => {
      return {
        id: Number(friend.user?.id),
        friendName: friend.user?.userName || "Unknown",
        status: friend.status,
        image: friend.user?.image || "",
        isFriendRequester: friend.isFriendRequester,
        isSelfRequester: friend.isSelfRequester,
      };
    });

  // 申請中
  const pendingFriends = friends
    .filter(
      (friend) => friend.status === "PENDING" && friend.id !== currentUserId,
    )
    .map((friend) => {
      return {
        id: Number(friend.id),
        friendName: friend.friendName || "Unknown",
        status: friend.status,
        image: friend.image || "",
        isFriendRequester: friend.isFriendRequester,
        isSelfRequester: friend.isSelfRequester,
      };
    });

  // 友達
  const acceptedFriends = friends
    .filter((friend) => friend.status === "ACCEPTED")
    .map((friend) => {
      const isCurrentUser = friend.id === currentUserId;
      return {
        id: Number(isCurrentUser ? friend.user?.id : friend.id),
      friendName: isCurrentUser ? friend.user?.userName || "Unknown" : friend.friendName || "Unknown",
      status: friend.status,
      image: isCurrentUser ? friend.user?.image || "" : friend.image || "",
      isFriendRequester: friend.isFriendRequester,
      isSelfRequester: friend.isSelfRequester,
      };
    });

  return (
    <>
      <FriendsProvider>
        <Header context="友達管理" />
        {/* Friend Search */}
        <div className="flex flex-col gap-2 px-10 py-6">
          <div className="h-32">
            <p className="text-sm font-semibold">友達追加</p>
            <FriendsSearchForm />
          </div>

          {hasFriends ? (
            <>
              {waitingFriends.length > 0 && (
                <>
                  <p>承認待ち</p>
                  <FriendsList friends={waitingFriends} />
                </>
              )}
              {pendingFriends.length > 0 && (
                <>
                  <p>申請中</p>
                  <FriendsList friends={pendingFriends} />
                </>
              )}
              {acceptedFriends.length > 0 && (
                <>
                  <p>友達</p>
                  <FriendsList friends={acceptedFriends} />
                </>
              )}
            </>
          ) : (
            <Image
              src="/img-nofriend.png"
              alt="profile"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </FriendsProvider>
    </>
  );
};

export default Page;
