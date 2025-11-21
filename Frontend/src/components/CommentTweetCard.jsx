import React from 'react'
import timeAgo from '../utils/TimeAgo'

function CommentTweetCard({type, avatar, username, createdAt, content, likes}) {
  return (
    <div key={createdAt} className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="avatar"
            src={avatar || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp" }
          />
        </div>
      </div>
      <div className="chat-header">
        {username}
        <time className="text-xs opacity-50">{timeAgo(createdAt)}</time>
      </div>
      <div className="chat-bubble">{content}</div>
      <div className="chat-footer opacity-50">{"likes"}</div>
    </div>
  )
}

export default CommentTweetCard