"use server";
import { UserInfo } from "@/types/user";

export async function getUserInfo() {
  // Todo: implement get user info

  // dummy data
  return {
    id: "1",
    username: "Ben Ono",
    language: "日本語",
    email: "benono123@gmail.com",
    profileImage: "/icon-sample-man.jpg",
    thumbnailImage: "",
  };
}

export async function updateUserInfo(updatedInfo: UserInfo) {
  // Todo: implement update user info

  // dummy data
  updatedInfo = {
    id: "00000001",
    username: "Tanaka Taro",
    language: "日本語",
    email: "benono123@gmail.com",
    profileImage: "/icon-sample-man.jpg",
    thumbnailImage: "/sample-thumbnailImage.jpg",
  };

  return updatedInfo;
}

export async function deleteUser() {
  // Todo : implement delete user
}
