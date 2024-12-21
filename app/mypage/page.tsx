"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import UserModal from "@/app/components/modals/UserModal";
import UserInfoCard from "@/app/components/UserInfoCard";
import { UserInfo } from "@/app/types/user";
import SignOut from "../components/SignOut";
import Navigation from "../components/Navigation";

import {
  getUserInfo,
  updateUserInfo,
  deleteUser,
} from "@/app/actions/userActions";
import { signOut } from "next-auth/react";

const Page: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo();
      setUserInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // change username
  const handleSaveUsername = async (newUsername: string) => {
    if (userInfo) {
      const updatedInfo = { ...userInfo, username: newUsername };
      try {
        const updatedUser = await updateUserInfo(updatedInfo);
        setUserInfo(updatedUser);
        handleCloseModal();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // change language
  const handleSaveLanguage = async (newLanguage: string) => {
    if (userInfo) {
      const updatedInfo = { ...userInfo, language: newLanguage };
      try {
        const updatedUser = await updateUserInfo(updatedInfo);
        setUserInfo(updatedUser);
        handleCloseModal();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // delete account
  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      alert("アカウントが削除されました");
      signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
    }
  };

  // Modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const handleCloseModal = () => {
    setIsUsernameModalOpen(false);
    setIsLanguageModalOpen(false);
    setIsDeleteAccountModalOpen(false);
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
          {/* Username Setting Section */}
          <div>
            {userInfo && (
              <UserInfoCard
                label="ユーザーネーム"
                value={userInfo.username}
                actionText="編集"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                onClick={() => setIsUsernameModalOpen(true)}
              />
            )}
          </div>
          {/* Language Setting Section */}
          <div>
            {userInfo && (
              <UserInfoCard
                label="言語設定"
                value={userInfo.language}
                actionText="変更"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                onClick={() => setIsLanguageModalOpen(true)}
              />
            )}
          </div>
          {/* Delete Account Section */}
          <div className="flex h-24 items-center justify-between">
            <div className="flex flex-col gap-1 font-medium">
              <p className="text-sm">アカウント変更</p>
            </div>
            <div
              className="flex cursor-pointer items-center gap-1 text-sm text-appleBlossom"
              onClick={() => setIsDeleteAccountModalOpen(true)}
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
                  className="mt-4 w-1/4 rounded-lg bg-denim px-1 py-2 text-sm text-white hover:bg-opacity-90"
                  onClick={handleCloseModal}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="mt-4 w-1/4 rounded-lg bg-appleBlossom px-1 py-2 text-white hover:bg-opacity-90"
                  onClick={handleDeleteAccount}
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
