"use server";
import { auth } from "@/lib/auth";
import { FriendData } from "../types/friend";
import { prisma } from "@/lib/prisma";
import { FriendStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllFriendData(): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return { status: "error", message: "認証されていません" };
  }

  const friendsData = await prisma.friend.findMany({
    where: {
      OR: [{ userId: user.id }, { friendId: user.id }],
    },
    include: {
      friend: {
        select: {
          id: true,
          userName: true,
          image: true,
        },
      },
      user: {
        select: {
          id: true,
          userName: true,
          image: true,
        },
      },
    },
  });

  const friends: FriendData[] = friendsData.map((friend) => ({
    id: friend.friend?.id,
    friendName: friend.friend?.userName || "Unknown",
    image: friend.friend?.image || "",
    status: friend.status || undefined,
    isSelfRequester: friend.userId === user.id,
    isFriendRequester: friend.friendId === user.id,
    user: friend.user
      ? {
          id: String(friend.user.id),
          userName: friend.user.userName,
          image: friend.user.image,
        }
      : undefined,
  }));

  return {
    message: "すべての友達データを取得しました",
    status: "success",
    items: friends,
  };
}

export async function searchFriendData(
  friendId: number,
): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { status: "error", message: "認証されていません" };
  }

  if (currentUser.id === friendId) {
    return { status: "error", message: "ユーザーが見つかりません" };
  }

  // Check friends
  try {
    const existingFriend = await prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId: currentUser.id,
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

    return { status: "success", message: "success", data: friendInfo };
  } catch (error) {
    console.error("Failed to search friend:", error);
    return {
      status: "error",
      message: "ユーザーが見つかりません",
    };
  }
}

export async function friendRequest(
  id: number,
): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    const updateFriendData = await prisma.friend.upsert({
      where: {
        userId_friendId: {
          userId: currentUser.id,
          friendId: id,
        },
      },
      update: {
        status: "PENDING",
      },
      create: {
        userId: currentUser.id,
        friendId: id,
        status: "PENDING",
      },
      include: {
        friend: {
          select: {
            id: true,
            userName: true,
            image: true,
          },
        },
      },
    });

    const updateFriend = {
      id: updateFriendData.friend.id,
      friendName: updateFriendData.friend.userName,
      image: updateFriendData.friend.image,
    };

    revalidatePath("/friend-management");

    return { status: "success", message: "申請しました", data: updateFriend };
  } catch (error) {
    console.error("Failed to send friend request", error);
    return {
      status: "error",
      message: "友達申請に失敗しました",
    };
  }
}

export async function deleteFriend(
  id: number,
): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    await prisma.friend.delete({
      where: {
        userId_friendId: {
          userId: currentUser.id,
          friendId: id,
        },
      },
    });
    revalidatePath("/friend-management");
    return { status: "success", message: "削除しました" };
  } catch (error) {
    console.error("Failed to delete a friend", error);
    return { status: "error", message: "削除に失敗しました" };
  }
}

export async function approveRequest(
  id: number,
): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    await prisma.friend.update({
      where: {
        userId_friendId: {
          userId: id,
          friendId: currentUser.id,
        },
      },
      data: {
        status: "ACCEPTED",
      },
    });

    revalidatePath("/friend-management");
    return { status: "success", message: "承認しました" };
  } catch (error) {
    console.error("Failed to approve friend request", error);
    return { status: "error", message: "承認に失敗しました" };
  }
}

export async function denyRequest(
  id: number,
): Promise<ActionState<FriendData>> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  // Get user_id
  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    return { status: "error", message: "認証されていません" };
  }

  try {
    await prisma.friend.update({
      where: {
        userId_friendId: {
          userId: id,
          friendId: currentUser.id,
        },
      },
      data: {
        status: "REJECTED",
      },
    });

    revalidatePath("/friend-management");
    return { status: "success", message: "拒否しました" };
  } catch (error) {
    console.error("Failed to approve friend request", error);
    return { status: "error", message: "拒否に失敗しました" };
  }
}
