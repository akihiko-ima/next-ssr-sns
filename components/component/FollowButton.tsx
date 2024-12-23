import React from 'react'

import { Button } from '../ui/button'
import { followAction } from '@/lib/actions'


interface FollowButtonProps {
  isCurrentUser: boolean,
  isFollowing: boolean,
  currentUserId: string,
  profileUserId: string,
}


const FollowButton = ({ isCurrentUser, isFollowing, currentUserId, profileUserId }: FollowButtonProps) => {

  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集";
    }

    if (isFollowing) {
      return "フォロー中"
    }

    return "フォローする"
  }

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "secondary";
    }

    if (isFollowing) {
      return "outline";
    }

    return "default";
  }

  return (
    <form action={followAction.bind(null, profileUserId, currentUserId)}>
      <Button variant={getButtonVariant()} className="w-full">{getButtonContent()}
      </Button>
    </form>
  )
}

export default FollowButton
