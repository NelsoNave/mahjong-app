"use client";

import { FriendData } from "../types/friend";

import React, { useState } from "react";
import Navigation from "@/app/components/Navigation";
import { searchFriendData } from "@/app/actions/friendActions";

const Page = () => {
  const [friendId, setFriendId] = useState<string>("");
  const [friendData, setFriendData] = useState<FriendData | null>(null);

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

  const handleAddFriend = () => {
    console.log("Friend added:", friendData);
    alert(`${friendData?.friendName}に友達申請を送りました`);
    setFriendData(null);
    setFriendId("");
  };

  const handleCancel = () => {
    setFriendData(null);
    setFriendId("");
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-background px-10 py-6"
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
          <div className="m-auto flex w-4/5 items-center justify-between rounded-2xl border bg-gray-100 px-6 py-3 text-center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
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
      <Navigation />
    </>
  );
};

export default Page;
