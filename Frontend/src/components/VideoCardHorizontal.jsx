import React from 'react'

function VideoCardHorizontal(
    thumbnail,
    title,
    channelName,
    views,
    timestamp,
    videoId,
    key
) {
  return (
    <div 
    key={key}
    className=" hover:bg-white/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer rounded-lg overflow-hidden w-full p-2 rounded-lg">
      <div className="flex flex-row gap-3 w-full">
        <figure className="w-2/5 flex-shrink-0">
          <img
            src={"http://res.cloudinary.com/dlncn8evb/image/upload/v1763206506/jlapf0aieciyfgjey1ft.png"}
            alt={"title"}
            className="w-full h-full object-cover rounded-md aspect-video"/>
        </figure>
        <div className="w-3/5 flex flex-col ">
          <h2 className="card-title text-md font-semibold text-white line-clamp-2 leading-tight mb-1">
            {"title title title title title title title"}
          </h2>
          <p className="text-xs text-white/80 line-clamp-1 mb-1">
            {"channelName"}
          </p>
          <div className="card-actions justify-start">
            <p className="text-xs text-white/80">
              {`${"views"} views`}
              <span className="mx-1">•</span>
              {"timestamp"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCardHorizontal