"use client"

import Image from "next/image";
import FriendButtons from "./FriendButtons";
import {
  approveRequest,
  deleteFriend,
  denyRequest,
  friendRequest,
} from "@/actions/friendActions";
import { useFriends } from "./FriendsContext";

type Props = {
  id: number;
  friendName: string;
  status?: string;
  image: string;
  isSelfRequester?: boolean;
  isFriendRequester?: boolean;
};

const FriendCard = ({ id, friendName, status, image, isSelfRequester, isFriendRequester }: Props) => {
  const commonStyles =
    "mt-2 flex items-center justify-between gap-4 rounded-md bg-neutral-50 px-4 py-2 shadow-[0_0_2px_0_rgba(53,40,1,0.3)]";

  const {setFriendData, setFriendId} = useFriends()

  const handleAddFriend = async (id: number) => {
    try {
      const result = await friendRequest(id);

      if (result.status === "success") {
        alert(result.message);
        setFriendData(null);
        setFriendId("");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("友達申請に失敗しました");
    }
  };

  const handleCancel = () => {
    setFriendData(null);
    setFriendId("");
  };

  const handleApprove = async (id: number) => {
    try {
      const result = await approveRequest(id);
      if (result.status === "success") {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("承認に失敗しました:", error);
      alert("承認に失敗しました");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await denyRequest(id);
      alert(result.message);
    } catch (error) {
      console.error("", error);
      alert("拒否に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteFriend(id);
      alert(result.message);
    } catch (error) {
      console.error("", error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className={commonStyles}>
      <div className="flex flex-row items-center gap-2">
        <Image
          src={image}
          alt="profile"
          width={40}
          height={40}
          className="h-[40px] w-[40px] rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <p>{friendName}</p>
          <p className="text-sm font-light">{id.toString().padStart(8, "0")}</p>
        </div>
      </div>
        <FriendButtons
          id={id}
          status={status}
          isFriendRequester={isFriendRequester}
          isSelfRequester={isSelfRequester}
          onRequest={handleAddFriend}
          onCancel={handleCancel}
          onAccepted={handleApprove}
          onRejected={handleReject}
          onDelete={handleDelete}
        />
    </div>
  );
};

export default FriendCard;
