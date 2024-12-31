"use client";

import {
  approveRequest,
  deleteFriend,
  denyRequest,
  friendRequest,
  getAllFriendData,
  searchFriendData,
} from "@/actions/friendActions";
import FriendCard from "@/components/FriendCard";
import Navigation from "@/components/Navigation";
import { FriendData } from "@/types/friend";
import Image from "next/image";
import React, {
  useState
} from "react";

const Page = () => {
  const [friendId, setFriendId] = useState<string>("");
  const [friendData, setFriendData] = useState<FriendData | null>(null);
  const [friendList, setFriendList] = useState<FriendData[]>([]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!friendId) {
      alert("IDを入力してください");
      return;
    }

    const friendIdNumber = parseInt(friendId);
    if (isNaN(friendIdNumber)) {
      alert("数値を入力してください");
      return;
    }

    try {
      const result = await searchFriendData(friendIdNumber)
      if(result.status === "success" && result.data) {
        setFriendData(result.data)
      } else {
        setFriendData(null)
        alert(result.message)
      }
    } catch (error) {
      console.error(error);
      alert("友達データの検索に失敗しました");
    }
  };

  // Send friend request
  const handleAddFriend = async (id: number) => {
    try {
      const result = await friendRequest(id)

      if (result.status === "success") {
        alert(result.message);
        setFriendData(null)
        setFriendId("")
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("友達申請に失敗しました");
    }
  };

  // Cancel friend request
  const handleCancel = () => {
    setFriendData(null);
    setFriendId("");
  };

  // Approve friend request
  const handleApprove = async () => {
    const friendIdNumber = parseInt(friendId);
    try {
      await approveRequest(friendIdNumber);
      alert("友達申請を承認しました");
      refreshFriendList();
    } catch (error) {
      console.error(error);
      alert("友達申請の承認に失敗しました");
    }
  };

  // Deny friend request
  const handleDenyRequest = async () => {
    const friendIdNumber = parseInt(friendId);
    try {
      await denyRequest(friendIdNumber);
      alert("友達申請を拒否しました");
      refreshFriendList();
    } catch (error) {
      console.error(error);
      alert("友達申請の拒否に失敗しました");
    }
  };

  // Delete friend
  const handleDeleteFriend = async () => {
    try {
      const friendIdNumber = parseInt(friendId);
      await deleteFriend(friendIdNumber);
      alert("友達情報を削除しました");
      refreshFriendList();
    } catch (error) {
      console.error(error);
      alert("友達情報の削除に失敗しました");
    }
  };

  const refreshFriendList = async () => {
    try {
      const updatedFriendList = await getAllFriendData();
      setFriendList(updatedFriendList);
    } catch (error) {
      console.error(error);
      alert("友達データの更新に失敗しました");
    }
  };

  const renderFriendCards = (status: string) => {
    const filteredFriends = friendList.filter(
      (friend) => friend.status === status,
    );

    if (filteredFriends.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-col">
        <p className="text-sm">
          {status === "pending"
            ? "承認待ち"
            : status === "approved"
              ? "友達"
              : status === "request pending"
                ? "申請中"
                : ""}
        </p>
        {filteredFriends.map((friend) => (
          <FriendCard
            key={friend.id}
            id={friend.id}
            friendName={friend.friendName}
            status={friend.status}
            image={friend.image}
            handleApprove={handleApprove}
            handleDenyRequest={handleDenyRequest}
            handleDeleteFriend={handleDeleteFriend}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Friend Search */}
      <div className="flex flex-col gap-2 px-10 py-6">
        <div className="h-32">
          <p className="text-sm font-semibold">友達追加</p>
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-background"
          >
            <div className="flex w-full justify-between border-b border-slate-400 px-4 py-2">
              <input
                type="text"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="IDを入力してください"
                className="flex-grow-[8] border-none bg-background outline-none"
              />
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width={20}
                  height={20}
                  className="flex-grow-[2]"
                >
                  <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </form>
          {friendData && (
            <div className="mt-2 flex items-center justify-between rounded-md border bg-neutral-50 px-4 py-2 text-center">
              <div className="flex items-center gap-2">
                <Image
                  src={friendData.image}
                  alt="profile"
                  width={40}
                  height={40}
                  className="h-[40px] w-[40px] rounded-full object-cover"
                />
                <p>{friendData.friendName}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCancel}
                  className="rounded bg-gray-400 px-4 py-1 text-sm text-white opacity-80 hover:opacity-60"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleAddFriend(friendData.id)}
                  className="rounded bg-amazon px-4 py-1 text-sm text-white opacity-70 hover:opacity-60"
                >
                  申請
                </button>
              </div>
            </div>
          )}
        </div>
        {friendList.length > 0 ? (
          <>
            {/* Pending Approval */}
            {renderFriendCards("pending")}
            {/* Pending Request */}
            {renderFriendCards("request pending")}
            {/* approved */}
            {renderFriendCards("approved")}
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
      <Navigation />
    </>
  );
};

export default Page;
