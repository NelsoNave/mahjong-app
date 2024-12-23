"use server";

import { UserInfo } from "@/types/user";

export async function getUserInfo() {
  // Todo: implement get user info

  // dummy data
  return {
    id: "1",
    userName: "Ben Ono",
    language: "日本語",
    email: "benono123@gmail.com",
    image: "/icon-sample-man.jpg",
    backgroundImage: "",
  };
}

export async function updateUserInfo(updatedInfo: UserInfo) {
  // Todo: implement update user info

  // dummy data
  updatedInfo = {
    id: "00000001",
    userName: "Tanaka Taro",
    language: "日本語",
    email: "benono123@gmail.com",
    image: "/icon-sample-man.jpg",
    backgroundImage: "/sample-thumbnailImage.jpg",
  };

  return updatedInfo;
}

export async function deleteUser() {
  // Todo : implement delete user
}
