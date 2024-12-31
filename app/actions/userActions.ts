"use server";

import { prisma } from "@/lib/prisma";
import { UserInfo } from "@/types/user";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const getUserInfo = async (): Promise<ActionState<UserInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "error", message: "認証されていません" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      userName: true,
      language: true,
      email: true,
      image: true,
      backgroundImage: true,
      subscriptionPlan: {
        select: {
          name: true
        }
      }
    }
  });

  if (!user) {
    return { message: "ユーザーが見つかりません", status: "error" };
  }

  return {
    data: {
      id: user.id.toString(),
      userName: user.userName,
      language:user.language === 'ja' ? '日本語' : user.language === 'en' ? 'English' : '日本語',
      email: user.email,
      image: user.image || "/icon-sample-man.jpg",
      backgroundImage: user.backgroundImage || "/sample-thumbnailImage.jpg",
      subscriptionPlan: user.subscriptionPlan?.name || "Free",
    },
    message: "success",
    status: "success"
  };
};




export const updateUserInfo = async (prevState: ActionState<UserInfo>, updatedInfo: UserInfo): Promise<ActionState<UserInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      status: "error",
      message: "認証されていません",
    };
  }

  if (!updatedInfo.userName?.trim()) {
    return {
      status: "error",
      message: "ユーザーネームを入力してください",
    };
  } 

  if (updatedInfo.userName.length > 50) {
    return {
      status: "error",
      message: "ユーザーネームは50文字以内で入力してください",
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        userName: updatedInfo.userName,
        language: updatedInfo.language,
        image: updatedInfo.image,
      },
      include: {
        subscriptionPlan: true,
      },
    });

    revalidatePath("/mypage");

    return {
      data: {
        id: updatedUser.id.toString(),
        userName: updatedUser.userName,
        language: updatedUser.language === 'ja' ? '日本語' : updatedUser.language === 'en' ? 'English' : '日本語',
        email: updatedUser.email,
        image: updatedUser.image || "/icon-sample-man.jpg",
        backgroundImage: updatedUser.backgroundImage || "/sample-thumbnailImage.jpg",
        subscriptionPlan: updatedUser.subscriptionPlan?.name || "Free",
      },
      status: "success",
      message: "ユーザー情報更新が完了しました",
    };
  } catch (error) {
    console.error('Failed to update user:', error);
    return {
      status: "error",
      message: "ユーザー情報の更新に失敗しました",
    };
  }
};

export const deleteUser = async (): Promise<ActionState<UserInfo>> => {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      status: "error",
      message: "認証されていません",
    };
  }

  try {
    const flg = true
    if (flg) {
      throw new Error("test");
    }
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user?.email || "" },
      });

      if (!user) {
        return {
          status: "error",
          message: "ユーザーが見つかりません",
        };
      }

      // Delete related data
      await tx.friend.deleteMany({
        where: {
          OR: [
            { userId: user.id },
            { friendId: user.id },
          ],
        },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    //revalidatePath("/mypage");
    return {
      message: "アカウントが削除されました",
      status: "success"
    };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return {
      message: "アカウントの削除に失敗しました",
      status: "error"
    };
  }
};