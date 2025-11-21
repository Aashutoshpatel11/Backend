import React from 'react'
import { NavLink, useNavigate } from "react-router";
import timeAgo from '../utils/TimeAgo';

function VideoCard({src, title, views, createdAt, channelImageSrc, channelName, videoId, duration, ownerId}) {
  
  const navigate = useNavigate()
  
  return (
    <div
    onClick={()=> navigate(`video/${videoId}`)}
    className="card bg-base-100 w-full shadow-sm hover:bg-white/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer rounded-lg overflow-hidden">
      <figure
        className="h-44 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${src || 'https://placehold.co/1600x900/1e293b/ffffff?text=No+Image'})`,
        }}
      > 
        <div className='absolute bottom-1 right-1 rounded-md px-2 py-1 bg-black/50 text-xs font-semibold ' >{`${Math.floor(duration/3600)}:${Math.floor(duration/60)}:${Math.floor(duration%60)}`}</div>
      </figure>
      <div className="card-body flex flex-row pt-4 pr-4 pb-4 pl-2">
        <div>
          <div className="avatar mr-1 pt-1">
            <div className="w-8 rounded-full">
              <img
                alt="Channel Avatar"
                src={channelImageSrc}
              />
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="card-title pb-1 text-base font-semibold text-zinc-900 dark:text-white line-clamp-2">
            {title}
          </h2>
          <span 
          onClick={(e)=>{
            e.stopPropagation();
            navigate(`/dashboard/${ownerId}`)
          }} 
          className="text-white/80 hover:underline  text-sm">
            {channelName}
          </span>
          <div className="flex gap-2 text-sm text-white/80 items-center ">
            <div>{`views: ${views}`}</div>
            <div className="border-l border-white/80 h-3"></div>
            <div>{timeAgo(createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard