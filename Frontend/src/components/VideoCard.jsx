import React from 'react'

function VideoCard({src, title, views, timestamp, channelImageSrc, channelName}) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
            <img
            src={src}
            alt='thumbnail' />
        </figure>
        <div className="card-body flex flex-row pt-4 pr-4 pb-4 pl-2">
            <div>
                <div className="avatar mr-1 pt-1">
                    <div className="w-8 rounded-full">
                    <img
                        alt="Channel Avatar"
                        src={channelImageSrc} />
                    </div>
                </div>
            </div>
            <div>
                <h2 className="card-title pb-1">{title}</h2>
                <p className='text-white/80  text-sm' >{channelName}</p>
                <div className='flex gap-3 text-sm text-white/80 items-center ' >
                    <div>{`views:${views}`}</div>
                    <div className='border-l border-white/80 h-3' ></div>
                    <div>{timestamp}</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VideoCard