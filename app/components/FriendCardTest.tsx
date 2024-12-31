"use client"

import Image from "next/image";
import FriendButtons from "./FriendButtons";
import {
  approveRequest,
  deleteFriend,
  denyRequest,
} from "@/actions/friendActions";

type Props = {
  id: number;
  friendName: string;
  status?: string;
  image: string;
};

const FriendCardTest = ({ id, friendName, status, image }: Props) => {
  const commonStyles =
    "mt-2 flex items-center justify-between gap-4 rounded-md bg-neutral-50 px-4 py-2 shadow-[0_0_2px_0_rgba(53,40,1,0.3)]";

  const handleApprove = async () => {
    try {
      const result = await approveRequest(id);
      alert(result.message);
    } catch (error) {
      console.error("承認に失敗しました:", error);
      alert("承認に失敗しました");
    }
  };

  const handleReject = async () => {
    try {
      const result = await denyRequest(id);
      alert(result.message);
    } catch (error) {
      console.error("", error);
      alert("拒否に失敗しました");
    }
  };

  const handleDelete = async () => {
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
      {status && (
        <FriendButtons
          status={status}
          onAccepted={handleApprove}
          onRejected={handleReject}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FriendCardTest;
