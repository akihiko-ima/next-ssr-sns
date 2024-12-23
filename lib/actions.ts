"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import prisma from "@/lib/prisma";

type State = {
  error?: string | undefined;
  success: boolean;
};

export async function addPostAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  // server actions
  try {
    const { userId } = auth();
    // console.log(userId);

    if (!userId) {
      return { error: "ユーザーが存在しません", success: false };
    }

    const postText = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, "ポスト内容を入力してください。")
      .max(140, "140字以内で入力してください。");

    const validatedPostText = postTextSchema.parse(postText);

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId,
      },
    });

    // データキャッシュする
    revalidatePath("/");

    return {
      error: undefined,
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false,
      };
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      };
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false,
      };
    }
  }
}

export const likeAction = async (postId: string) => {
  const { userId } = auth();
  // console.log(userId);

  if (!userId) {
    throw new Error("User is not authenticated");
  }
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      revalidatePath("/");
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const followAction = async (
  currentUserId: string,
  profileUserId: string
) => {
  if (!currentUserId) {
    throw new Error("User is not authenticated");
  }

  try {
    // フォロー関係の存在確認
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: profileUserId,
      },
    });

    if (existingFollow) {
      // フォロー解除
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: profileUserId,
          },
        },
      });
      console.log(`フォロー解除成功: ${currentUserId} -> ${profileUserId}`);
    } else {
      // 新たにフォロー
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: profileUserId,
        },
      });
      console.log(`フォロー成功: ${currentUserId} -> ${profileUserId}`);
    }

    // キャッシュの再検証
    revalidatePath(`/profile/${profileUserId}`);
  } catch (error) {
    console.error("フォロー処理中にエラーが発生しました:", error);
    throw new Error("フォロー処理中に問題が発生しました。");
  }
};
