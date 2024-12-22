import React from "react";
import Image from "next/image";
import { FriendData } from "@/app/types/friend";

interface FriendCardProps extends FriendData {
  handleApprove: () => void;
  handleDenyRequest: () => void;
  handleDeleteFriend: (id: number) => void;
}

const FriendCard = ({
  id,
  friendName,
  status,
  profileImage,
  handleApprove,
  handleDenyRequest,
  handleDeleteFriend,
}: FriendCardProps) => {
  if (status === "pending") {
    return (
      <div className="mt-2 flex items-center justify-between gap-4 rounded-md bg-neutral-50 px-4 py-2 shadow-[0_0_2px_0_rgba(53,40,1,0.3)]">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={profileImage}
            alt="profile"
            width={40}
            height={40}
            className="h-[40px] w-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <p>{friendName}</p>
            <p className="text-sm font-light">
              {id.toString().padStart(8, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded bg-appleBlossom px-4 py-1 text-sm text-white hover:opacity-90"
            onClick={handleDenyRequest}
          >
            拒否
          </button>
          <button
            onClick={handleApprove}
            className="bg-amazon rounded px-4 py-1 text-sm text-white opacity-70 hover:opacity-60"
          >
            承認
          </button>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="mt-2 flex items-center justify-between gap-4 rounded-md bg-neutral-50 p-2 px-4 py-2 shadow-[0_0_2px_0_rgba(53,40,1,0.3)]">
        <div className="flex flex-row items-center gap-2">
          <Image
            src={profileImage}
            alt="profile"
            width={40}
            height={40}
            className="h-[40px] w-[40px] rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <p>{friendName}</p>
            <p className="text-sm font-light">
              {id.toString().padStart(8, "0")}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => handleDeleteFriend(id)}
            className="py-1 text-sm text-white hover:opacity-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width={20}
              height={20}
              className="text-appleBlossom"
            >
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="mt-2 flex items-center gap-4 rounded-md bg-red-50 p-2 shadow-[0_0_2px_0_rgba(53,40,1,0.3)]">
        <p className="font-semibold text-red-600">拒否されました</p>
      </div>
    );
  }

  return null;
};

export default FriendCard;
