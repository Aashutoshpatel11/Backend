import React from 'react'
import { TbThumbUp } from "react-icons/tb";

function VideoPlayer(videosrc) {
  return (
    <div>
        <video 
        className='w-full h-auto mx-auto rounded-lg shadow-lg bg-black'
        controls 
        src="https://res.cloudinary.com/dlncn8evb/video/upload/v1762086016/mpjnunk2esbgwjealyqt.mp4">
        </video>
        <div className='flex flex-col' >
            <h1 className='text-2xl font-semibold mt-4 mb-2'>Video Title</h1>
            <div className='flex justify-between gap-2' >
                <div className='flex gap-4 text-sm' >
                    <div className="w-10 rounded-full">
                    <img
                        className='w-full rounded-full'
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                    <div className='flex flex-col h-full p-0 justify-between ' >
                        <p className='font-semibold' >Channel Name</p>
                        <p className='text-white/50' >Subscribers</p>
                    </div>
                    <button
                    className='btn rounded-full btn-md text-black bg-white hover:bg-white/50'
                    type="button">Subscribe</button>
                </div>
                <div>
                    <button 
                    className='btn rounded-full btn-md p-2 px-4 text-white bg-base-300 hover:bg-white/10'
                    type="button">
                        <TbThumbUp  />
                        {"count"}
                        </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VideoPlayer