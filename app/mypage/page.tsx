"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import UserModal from "@/app/components/modals/UserModal";
import UserInfoCard from "@/app/components/UserInfoCard";
import { UserInfo } from "@/app/types/user";
import SignOut from "../components/SignOut";
import Navigation from "../components/Navigation";

const Page: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Fetch user info
  async function getUserInfo(): Promise<UserInfo> {
    try {
      // Todo: replace with actual URL
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await getUserInfo();

        // dummy data
        const data = {
          id: "00000001",
          username: "Ben Ono",
          language: "日本語",
          email: "benono123@gmail.com",
          profileImage: "/icon-sample-man.jpg",
        };

        setUserInfo(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Update user info
  const updateUserInfo = async (updatedInfo: UserInfo) => {
    try {
      // Todo: replace with actual URL
      const res = await fetch("https://testURL/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!res.ok) {
        throw new Error("Failed to update user info");
      }

      const updatedUser = await res.json();
      setUserInfo(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  // Modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  // Modal open handlers
  const handleEditUsernameClick = () => setIsUsernameModalOpen(true);
  const handleEditLanguageClick = () => setIsLanguageModalOpen(true);
  const handleDeleteAccountClick = () => setIsDeleteAccountModalOpen(true);

  // Modal close handlers
  const handleCloseModal = () => {
    setIsUsernameModalOpen(false);
    setIsLanguageModalOpen(false);
    setIsDeleteAccountModalOpen(false);
  };

  const handleDeleteClick = async () => {
    // Todo: Implement account delete logic
    try {
      const res = await fetch("https://testURL/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      alert("アカウントが削除されました");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUsername = async (newUsername: string) => {
    if (userInfo) {
      const updatedInfo = { ...userInfo, username: newUsername };
      await updateUserInfo(updatedInfo);
      handleCloseModal();
    }
  };

  const handleSaveLanguage = async (newLanguage: string) => {
    if (userInfo) {
      const updatedInfo = { ...userInfo, language: newLanguage };
      await updateUserInfo(updatedInfo);
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="bg-pineGlade h-full">
        <div className="bg-pineGlade h-[15%]"></div>
        <div className="relative h-[85%] rounded-t-[40px] bg-background px-7">
          <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-white">
            {userInfo && (
              <>
                <Image
                  src={userInfo.profileImage}
                  width={80}
                  height={80}
                  alt="icon"
                  objectFit="cover"
                  className="h-full w-full rounded-full p-1"
                />
                <p className="text-sm text-gray-700">{userInfo.email}</p>
              </>
            )}
          </div>
          <div className="pt-28">
            {userInfo && (
              <UserInfoCard
                label="ID"
                value={userInfo.id}
                actionText="コピー"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                onClick={() => {
                  navigator.clipboard.writeText(userInfo.id);
                  alert("ID copied to clipboard!");
                }}
              />
            )}
          </div>
          <div>
            {userInfo && (
              <UserInfoCard
                label="ユーザーネーム"
                value={userInfo.username}
                actionText="編集"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                onClick={handleEditUsernameClick}
              />
            )}
          </div>
          <div>
            {userInfo && (
              <UserInfoCard
                label="言語設定"
                value={userInfo.language}
                actionText="変更"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                onClick={handleEditLanguageClick}
              />
            )}
          </div>
          <div className="flex h-24 items-center justify-between">
            <div className="flex flex-col gap-1 font-medium">
              <p className="text-sm">アカウント変更</p>
            </div>
            <div
              className="text-amazon flex items-center gap-1 text-sm"
              onClick={handleDeleteAccountClick}
            >
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
          {/* Modals */}
          <UserModal isOpen={isUsernameModalOpen} onClose={handleCloseModal}>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newUsername = (form.username as HTMLInputElement).value;
                handleSaveUsername(newUsername);
              }}
            >
              <div className="flex flex-col gap-4">
                <label>ユーザー名を入力してください</label>
                <input
                  name="username"
                  type="text"
                  className="mt-2 w-full rounded-md border p-2"
                  defaultValue={userInfo?.username}
                />
              </div>
              <button
                type="submit"
                className="bg-denim ml-auto mt-4 w-1/4 rounded-lg p-2 text-white hover:bg-opacity-90"
              >
                保存
              </button>
            </form>
          </UserModal>
          <UserModal isOpen={isLanguageModalOpen} onClose={handleCloseModal}>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newLanguage = (form.language as HTMLInputElement).value;
                handleSaveLanguage(newLanguage);
              }}
            >
              <div className="flex flex-col gap-4">
                <label>言語を選択してください</label>
                <select
                  name="language"
                  className="mt-2 w-full rounded-md border p-2"
                  defaultValue={userInfo?.language}
                >
                  <option value="jp">日本語</option>
                  <option value="en">英語</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-denim ml-auto mt-4 w-1/4 rounded-lg p-2 text-white hover:bg-opacity-90"
              >
                保存
              </button>
            </form>
          </UserModal>
          <UserModal
            isOpen={isDeleteAccountModalOpen}
            onClose={handleCloseModal}
          >
            <form className="flex flex-col gap-4">
              <p>アカウントを削除しますか？</p>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-denim mt-4 w-1/4 rounded-lg px-1 py-2 text-sm text-white hover:bg-opacity-90"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-appleBlossom mt-4 w-1/4 rounded-lg px-1 py-2 text-white hover:bg-opacity-90"
                  onClick={handleDeleteClick}
                >
                  削除
                </button>
              </div>
            </form>
          </UserModal>
          <SignOut />
        </div>
      </div>
      <Navigation />
    </>
  );
};

export default Page;
