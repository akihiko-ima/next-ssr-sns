"use client";
import React, { useOptimistic } from "react";
import { useAuth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";
import { Button } from "../ui/button";
import { likeAction } from "@/lib/actions";

interface LikeState {
  likeCount: number;
  isLiked: boolean;
}

type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
};

const PostInteraction = ({
  postId,
  initialLikes,
  commentNumber,
}: PostInteractionProps) => {
  const { userId } = useAuth();

  const initialState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false,
  };

  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(
    initialState,
    (currentState) => ({
      likeCount: currentState.isLiked
        ? currentState.likeCount - 1
        : currentState.likeCount + 1,
      isLiked: !currentState.isLiked,
    })
  );

  const handleLikeClick = async () => {
    try {
      addOptimisticLike();
      await likeAction(postId);
      revalidatePath(`/posts/${postId}`);
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon" onClick={handleLikeClick}>
        <HeartIcon
          className={`h-5 w-5 transition-colors duration-300 ${optimisticLike.isLiked ? "text-destructive" : "text-muted-foreground"
            }`}
        />
      </Button>
      <span
        className={`-ml-1 transition-colors duration-300 ${optimisticLike.isLiked ? "text-destructive" : "text-muted-foreground"
          }`}
      >
        {optimisticLike.likeCount}
      </span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span className="-ml-1">{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default PostInteraction;
