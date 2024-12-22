"use server";
import { FriendData } from "../types/friend";

export async function getAllFriendData() {
  // Todo: implement get friend info

  // dummy data
  return [
    {
      id: 1,
      friendName: "Tanaka Taro",
      status: "pending",
      profileImage: "/sample-profile1.jpg",
    },
    {
      id: 3,
      friendName: "Tanaka Hanako",
      status: "approved",
      profileImage: "/sample-profile2.png",
    },
    {
      id: 4,
      friendName: "Satou Jirou",
      status: "approved",
      profileImage: "/sample-profile3.png",
    },
  ];
  // return [];
}

export async function searchFriendData(friendId: number): Promise<FriendData> {
  // Todo: implement search friend info

  // dummy data
  const updatedInfo = {
    id: 3,
    friendName: "Suzuki Kakeru",
    status: "approved",
    profileImage: "/sample-profile2.png",
  };

  return updatedInfo;
}

export async function deleteFriend(id: number) {
  // Todo: implement delete friend
  return "";
}

export async function approveRequest(id: number) {
  // Todo : implement approve request
  return "";
}

export async function denyRequest(id: number) {
  // Todo : implement deny request
}
