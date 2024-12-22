"use client";

import React, { useState } from "react";
import Navigation from "@/app/components/Navigation";
import { searchFriendData } from "@/app/actions/friendActions";

const Page = () => {
  const [friendId, setFriendId] = useState<string>("");

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
      const friendData = await searchFriendData(friendIdNumber);
      console.log(friendData);
    } catch (error) {
      console.error("Error searching friend data:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center">
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
      </div>
      <Navigation />
    </>
  );
};

export default Page;
