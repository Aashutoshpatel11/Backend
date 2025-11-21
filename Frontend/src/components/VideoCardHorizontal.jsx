import React from 'react'
import { Link, useNavigate } from 'react-router'
import timeAgo from '../utils/TimeAgo'

function VideoCardHorizontal(
    {thumbnail, title, channelName, views, createdAt, videoId, duration, ownerId, classes=""}
) {
  const navigate = useNavigate()
  return (
    <div 
    onClick={()=> navigate(`/video/${videoId}`)}
    className={` hover:bg-white/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer overflow-hidden w-full md:w-3/4 lg:w-1/2 p-2 rounded-lg  ${classes}`}>
      <div className="flex flex-row gap-3 w-full">
        <figure className="w-2/5 shrink-0 relative">
        <div className='absolute z-10 bottom-1 right-1 rounded-md px-2 py-1 bg-black/50 text-xs font-semibold ' >{`${Math.floor(duration/3600)}:${Math.floor(duration/60)}:${Math.floor(duration%60)}`}</div>
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full z-0 object-cover rounded-md aspect-video"/>
        </figure>
        <div className="w-3/5 flex flex-col ">
          <h2 className="card-title text-md font-semibold text-white line-clamp-2 leading-tight mb-1">
            {title}
          </h2>
          <span
            onClick={(e) => {
              e.stopPropagation();      // Prevent triggering video link
              navigate(`/dashboard/${ownerId}`);
            }}
            className="hover:underline text-xs text-white/80 line-clamp-1 mb-1 cursor-pointer"
          >
            {channelName}
          </span>
          <div className="card-actions justify-start">
            <p className="text-xs text-white/80">
              {`${views} views`}
              <span className="mx-1">•</span>
              {timeAgo(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardHorizontal