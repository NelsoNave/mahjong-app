import React from "react";
import Navigation from "@/app/components/Navigation";
import Image from "next/image";
import SignOut from "@/app/components/SignOut";
import { UserInfo, UserInfoCardProps } from "@/app/types/user";

export async function getUserInfo(): Promise<UserInfo> {
  try {
    const res = await fetch("https://testURL");

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const UserInfoCard = ({ label, value, actionText, d }: UserInfoCardProps) => (
  <div className="border-b-0.5 flex h-24 items-center justify-between border-slate-400">
    <div className="flex flex-col gap-1 font-medium">
      <p className="text-sm">{label}</p>
      <p>{value}</p>
    </div>
    <div className="text-amazon flex items-center gap-1 text-sm">
      <p>{actionText}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
      >
        <path d={d} />
      </svg>
    </div>
  </div>
);

const Page = async () => {
  // Use actual API calls once it is ready.
  // const userInfo = await getUserInfo();

  // dummy data
  const userInfo = {
    id: "00000001",
    username: "Ben Ono",
    language: "日本語",
    email: "benono123@gmail.com",
    profileImage: "/icon-sample-man.jpg",
  };

  return (
    <>
      <div className="bg-pineGlade h-full">
        <div className="bg-pineGlade h-[15%]"></div>
        <div className="relative h-[85%] rounded-t-[40px] bg-background px-7">
          {/* profile icon */}
          <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-white">
            <Image
              src={userInfo.profileImage}
              width={80}
              height={80}
              alt="icon"
              objectFit="cover"
              className="h-full w-full rounded-full p-1"
            />
            <p className="text-sm text-gray-700">{userInfo.email}</p>
          </div>
          <div className="pt-28">
            <UserInfoCard
              label="ID"
              value={userInfo.id}
              actionText="コピー"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
            <UserInfoCard
              label="ユーザーネーム"
              value={userInfo.username}
              actionText="編集"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
            <UserInfoCard
              label="言語設定"
              value={userInfo.language}
              actionText="変更"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
            <div className="flex h-24 items-center justify-between">
              <div className="flex flex-col gap-1 font-medium">
                <p className="text-sm">アカウント変更</p>
              </div>
              <div className="text-amazon flex items-center gap-1 text-sm">
                <p>削除</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="16"
                  height="16"
                >
                  <path d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
          <SignOut />
        </div>
      </div>
      <Navigation />
    </>
  );
};

export default Page;
