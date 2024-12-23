// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";

import { fetchPosts } from "@/lib/postDataFetcher";
import { Button } from "@/components/ui/button";
import Post from "./Post";

export default async function PostList({ username }: { username: string }) {
  const { userId } = auth();

  // userIdの情報がなければログアウト
  if (!userId) {
    return;
  }

  const posts = await fetchPosts(userId, username);

  return (
    <div className="space-y-4">
      {posts?.length ? (
        posts.map((post) => (
          <Post key={post.id} post={post} /> // JSX構文を修正
        ))
      ) : (
        <div>Postが見つかりません。</div>
      )}
    </div>
  );
}
