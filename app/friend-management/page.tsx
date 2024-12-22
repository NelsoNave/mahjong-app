"use client";

import { FriendData } from "../types/friend";

import React, { useEffect, useState } from "react";
import Navigation from "@/app/components/Navigation";
import {
  searchFriendData,
  getAllFriendData,
  approveRequest,
  denyRequest,
} from "@/app/actions/friendActions";
import FriendCard from "@/app/components/FriendCard";

const Page = () => {
  const [friendId, setFriendId] = useState<string>("");
  const [friendData, setFriendData] = useState<FriendData | null>(null);
  const [friendList, setFriendList] = useState<FriendData[]>([]);

  useEffect(() => {
    const fetchAllFriendData = async () => {
      try {
        const friendList = await getAllFriendData();
        setFriendList(friendList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllFriendData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!friendId) {
      alert("IDを入力してください");
      return;
    } else if (isNaN(parseInt(friendId))) {
      alert("数値を入力してください");
      return;
    }

    try {
      const friendIdNumber = parseInt(friendId);
      const result = await searchFriendData(friendIdNumber);
      setFriendData(result);
    } catch (error) {
      console.error(error);
      alert("数値を入力してください");
    }
  };

  // Send friend request
  const handleAddFriend = () => {
    console.log("Friend added:", friendData);
    alert(`${friendData?.friendName}に友達申請を送りました`);
    setFriendData(null);
    setFriendId("");
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
      const friendList = await getAllFriendData();
      setFriendList(friendList);
    } catch (error) {
      console.error(error);
    }
  };

  // Deny friend request
  const handleDenyRequest = async () => {
    const friendIdNumber = parseInt(friendId);
    try {
      await denyRequest(friendIdNumber);
      alert("友達申請を拒否しました");
      const friendList = await getAllFriendData();
      setFriendList(friendList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 px-10 py-6">
        <div className="">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width={20}
                height={20}
                onClick={handleSubmit}
                className="flex-grow-[2]"
              >
                <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </form>
          {friendData && (
            <div className="mt-2 flex items-center justify-between rounded-2xl border bg-gray-100 px-6 py-3 text-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width={20}
                  height={20}
                >
                  <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <p>
                  <span>{friendData.friendName}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCancel}
                  className="rounded bg-slate-400 px-4 py-1 text-sm text-white hover:opacity-90"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddFriend}
                  className="bg-pineGlade rounded px-4 py-1 text-sm text-white hover:opacity-90"
                >
                  申請
                </button>
              </div>
            </div>
          )}
        </div>
        {friendList.length > 0 ? (
          <div>
            <div>
              <p className="text-sm">承認待ち</p>
              {friendList.map((friend) => {
                return friend.status === "pending" ? (
                  <FriendCard
                    key={friend.id}
                    id={friend.id}
                    friendName={friend.friendName}
                    status={friend.status}
                    handleApprove={handleApprove}
                    handleDenyRequest={handleDenyRequest}
                  />
                ) : null;
              })}
            </div>
            <div className="text-sm">申請中</div>
            <div>
              <p className="text-sm">友達</p>
              {friendList.map((friend) => {
                return friend.status === "approved" ? (
                  <FriendCard
                    key={friend.id}
                    id={friend.id}
                    friendName={friend.friendName}
                    status={friend.status}
                    handleApprove={handleApprove}
                    handleDenyRequest={handleDenyRequest}
                  />
                ) : null;
              })}
            </div>
          </div>
        ) : (
          <div>友達がいません</div>
        )}
      </div>
      <Navigation />
    </>
  );
};

export default Page;
