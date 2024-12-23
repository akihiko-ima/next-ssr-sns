import prisma from "./prisma";

export async function fetchPosts(clerkId: string, username?: string) {
  // プロフィールタイムライン
  if (username) {
    return await prisma.post.findMany({
      where: {
        author: {
          name: username,
        },
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ホームタイムライン
  if (!username && clerkId) {
    // clerkIdをもとにuserIdを取得
    const userId = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      select: {
        id: true,
      },
    });

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId?.id,
      },
      select: {
        following: {
          // `following` リレーションをたどる
          select: {
            clerkId: true, // `clerkId`を取得
          },
        },
      },
    });
    const followingIds = following.map((f) => f.following.clerkId);
    const ids = [clerkId, ...followingIds];
    return await prisma.post.findMany({
      where: {
        authorId: {
          in: ids,
        },
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
