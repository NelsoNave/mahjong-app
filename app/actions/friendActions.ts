"use server";
import { auth } from "@/lib/auth";
import { FriendData } from "../types/friend";
import { prisma } from "@/lib/prisma";
import { FriendStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllFriendData(): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  const friends = await prisma.friend.findMany();

  return {
    data: {
      // status: friends;
      // userId: number;
      // friendId: number;
      // createdAt: Date;
      // updatedAt: Date;
    },
    message: "success",
    status: "success",
  };

  // dummy data
  // return [
  //   {
  //     id: 1,
  //     friendName: "Tanaka Taro",
  //     status: "pending",
  //     image: "/sample-profile1.jpg",
  //   },
  //   {
  //     id: 3,
  //     friendName: "Tanaka Hanako",
  //     status: "approved",
  //     image: "/sample-profile2.png",
  //   },
  //   {
  //     id: 4,
  //     friendName: "Satou Jirou",
  //     status: "approved",
  //     image: "/sample-profile3.png",
  //   },
  //   {
  //     id: 5,
  //     friendName: "Satou Jirou",
  //     status: "request pending",
  //     image: "/sample-profile3.png",
  //   },
  //   {
  //     id: 6,
  //     friendName: "Satou Jirou",
  //     status: "request pending",
  //     image: "/sample-profile3.png",
  //   },
  // ];
  // return [];
}

export async function searchFriendData(
  friendId: number,
): Promise<FriendData | ActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = session.user.id;
  if (!currentUser) {
    return { status: "error", message: "ユーザーが見つかりません" };
  }

  // Check friends
  try {
    const existingFriend = await prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: Number(session.user.id),
          friendId: friendId,
        },
      },
    });

    if (existingFriend?.status === FriendStatus.ACCEPTED) {
      return { status: "error", message: "ユーザーが見つかりません" };
    }

    if (existingFriend?.status === FriendStatus.PENDING) {
      return { status: "error", message: "ユーザーが見つかりません" };
    }

    // Get friend data
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { id: true, userName: true, image: true },
    });

    if (!friend) {
      return { status: "error", message: "ユーザーが見つかりません" };
    }

    // Formatting friend data
    const friendInfo = {
      id: friend.id,
      friendName: friend.userName,
      image: friend.image,
    };

    return friendInfo;
  } catch (error) {
    console.error("Failed to search friend:", error);
    return {
      status: "error",
      message: "ユーザーが見つかりません",
    };
  }
}

export async function friendRequest(id: number): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }
  const currentUserId = Number(session.user.id);

  try {
    if (currentUserId === id) {
      return {
        status: "error",
        message: "友達申請に失敗しました",
      };
    }
    const updateFriend = await prisma.friend.upsert({
      where: {
        userId_friendId: {
          userId: currentUserId,
          friendId: id,
        },
      },
      update: {
        status: "PENDING",
      },
      create: {
        userId: currentUserId,
        friendId: id,
        status: "PENDING",
      },
    });

    revalidatePath("/friend-management")

    return { status: "success", message: "", data: updateFriend };
    
  } catch (error) {
    console.error("Failed to send friend request", error);
    return {
      status: "error",
      message: "友達申請に失敗しました",
    };
  }
}

export async function deleteFriend(id: number) {
  // Todo: implement delete friend
  return "";
}

export async function approveRequest(id: number) {
  // Todo : implement approve request
  // dummy data
  const updatedInfo = {
    id: 3,
    friendName: "Suzuki Kakeru",
    status: "approved",
    image: "/sample-profile2.png",
  };

  return updatedInfo;
}

export async function denyRequest(id: number) {
  // Todo : implement deny request
}
