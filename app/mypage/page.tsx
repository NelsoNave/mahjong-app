"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useActionState,
  useTransition,
} from "react";
import Image from "next/image";
import UserModal from "@/components/modals/UserModal";
import UserInfoCard from "@/components/UserInfoCard";
import { UserInfo } from "@/types/user";
import SignOut from "@/components/SignOut";
import Navigation from "@/components/Navigation";
import { getUserInfo, updateUserInfo, deleteUser } from "@/actions/userActions";
import { signOut } from "next-auth/react";

const initialState: ActionState<UserInfo> = {
  status: "initial",
  message: "",
};

const Page: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  const [isHydrated, setIsHydrated] = useState(false);

  // Modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  // Action state
  const [updateState, updateAction] = useActionState<
    ActionState<UserInfo>,
    [UserInfo]
  >(
    async (state, [updatedInfo]) => updateUserInfo(state, updatedInfo),
    initialState,
  );
  const [deleteState, deleteAction] = useActionState<ActionState<UserInfo>>(
    deleteUser,
    initialState,
  );

  const handleCloseModal = () => {
    setIsUsernameModalOpen(false);
    setIsLanguageModalOpen(false);
    setIsDeleteAccountModalOpen(false);
  };

  useEffect(() => {
    setIsHydrated(true);

    const fetchUserInfo = async () => {
      try {
        const result = await getUserInfo();
        setUserInfo(result.data as UserInfo);
      } catch (err) {
        console.log("xxx");
        console.error(err);
        alert("ユーザー情報の取得に失敗しました");
      }
    };

    fetchUserInfo();
  }, []);

  // change user info
  useEffect(() => {
    if (updateState.status === "success" && updateState.data) {
      setUserInfo(updateState.data as UserInfo);
      handleCloseModal();
    } else if (updateState.status === "error") {
      alert(updateState.message);
    }
  }, [updateState]);

  // delete user info
  useEffect(() => {
    if (deleteState.status === "success") {
      signOut({ callbackUrl: "/" });
    } else if (deleteState.status === "error") {
      alert(deleteState.message);
    }
  }, [deleteState]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  // Update user info
  const handleUpdateUserInfo = async (field: string, newValue: string) => {
    if (!userInfo) return;

    if (field === "userName") {
      if (!newValue.trim()) {
        alert("ユーザーネームを入力してください");
        return;
      }

      if (newValue.length > 50) {
        alert("ユーザーネームは50文字以内で入力してください");
        return;
      }
    }

    const updatedInfo = { ...userInfo, [field]: newValue };
    setUserInfo(updatedInfo);
    try {
      startTransition(async () => {
        await updateAction([updatedInfo]);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      startTransition(async () => {
        await deleteAction();
      });
    } catch (err) {
      // TODO Handle unexpected error
      console.error(err);
    }
  };

  // Change background image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const backgroundImage = URL.createObjectURL(file);
      if (userInfo) {
        const updatedInfo = { ...userInfo, backgroundImage: backgroundImage };
        try {
          setUserInfo(updatedInfo);
        } catch (err) {
          console.error(err);
          alert("サムネイル画像の更新に失敗しました");
        }
      }
    }
  };

  return (
    <>
      <div className="bg-pineGlade h-full">
        {/* Background image */}
        <div
          className="bg-pineGlade group flex h-[15%] items-center justify-center"
          onClick={handleFileClick}
          style={{
            backgroundImage:
              userInfo && userInfo.backgroundImage
                ? `url(${userInfo.backgroundImage})`
                : "none",
            backgroundColor:
              userInfo && !userInfo.backgroundImage
                ? "bg-pineGlade"
                : "transparent",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!userInfo?.backgroundImage && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              className="transition-opacity duration-300 hover:text-gray-400"
            >
              <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg, .png"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {/* User profile */}
        <div className="relative h-[85%] bg-background px-7">
          <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-white">
            {userInfo && (
              <>
                <Image
                  src={userInfo.image}
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
          <div className="h-full">
            {/* ID Section */}
            <div className="pt-28">
              {userInfo && (
                <UserInfoCard
                  label="ID"
                  value={userInfo.id.padStart(8, "0")}
                  actionText="コピー"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  onClick={() => {
                    navigator.clipboard.writeText(userInfo.id);
                    alert("IDをコピーしました"); // Todo: change the message
                  }}
                />
              )}
              {/* UserName Setting Section */}
              {userInfo && (
                <UserInfoCard
                  label="ユーザーネーム"
                  value={userInfo?.userName}
                  actionText="編集"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  onClick={() => setIsUsernameModalOpen(true)}
                />
              )}
              {/* Language Setting Section */}
              {userInfo && (
                <UserInfoCard
                  label="言語設定"
                  value={userInfo?.language}
                  actionText="変更"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  onClick={() => setIsLanguageModalOpen(true)}
                />
              )}
            </div>
            {/* Delete Account Section */}
            <div className="flex items-center justify-between py-6">
              <div className="flex flex-col gap-1 font-medium">
                <p className="text-sm font-medium text-gray-700">
                  アカウント変更
                </p>
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
            <div className="mt-4">
              <SignOut />
            </div>
          </div>
          {/* Modals */}
          <UserModal isOpen={isUsernameModalOpen} onClose={handleCloseModal}>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.userName as HTMLInputElement).name;
                const newValue = (form[name] as HTMLInputElement).value;
                handleUpdateUserInfo(name, newValue);
              }}
            >
              <div className="flex flex-col gap-4">
                <label>ユーザー名を入力してください</label>
                <input
                  name="userName"
                  type="text"
                  className="mt-2 w-full rounded-md border p-2"
                  defaultValue={userInfo?.userName}
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
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
                const name = (form.language as HTMLInputElement).name;
                const newValue = (form[name] as HTMLInputElement).value;
                handleUpdateUserInfo(name, newValue);
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
            <div className="flex flex-col gap-4">
              <p>アカウントを削除しますか？</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-denim mt-4 w-1/4 rounded-lg px-1 py-2 text-sm text-white hover:bg-opacity-90"
                  onClick={handleCloseModal}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="mt-4 w-1/4 rounded-lg bg-appleBlossom px-1 py-2 text-white hover:bg-opacity-90"
                  onClick={handleDeleteAccount}
                >
                  削除
                </button>
              </div>
            </div>
          </UserModal>
        </div>
      </div>
      <Navigation />
    </>
  );
};

export default Page;
