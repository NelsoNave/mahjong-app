"use server";
import { FriendData } from "../types/friend";

export async function getAllFriendData() {
  // Todo: implement get friend info

  // dummy data
  return [
    { id: "00000001", friendName: "Tanaka Taro", status: "pending" },
    { id: "00000002", friendName: "Suzuki Kakeru", status: "approved" },
  ];
}

export async function searchFriendData(friendData: FriendData) {
  // Todo: implement search friend info

  // dummy data
  const updatedInfo = {
    id: "00000002",
    friendName: "Suzuki Kakeru",
    status: "approved",
  };

  return updatedInfo;
}

export async function approveRequest(id: number) {
  // Todo : implement approve request
}

export async function denyRequest(id: number) {
  // Todo : implement deny request
}
