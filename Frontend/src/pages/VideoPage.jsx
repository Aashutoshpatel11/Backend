import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import VideoPlayer from '../components/VideoPlayer';
import CommentTweetCard from '../components/CommentTweetCard';
import VideoCardHorizontal from '../components/VideoCardHorizontal';

function VideoPage() {
    const videoId = useParams()
    
  return (
    <div className='  xl:flex w-full h-full p-10 gap-10' >
      <div className='w-full xl:w-2/3' >
        <VideoPlayer />
        <div className='w-full mb-4 bg-neutral text-white/90 text-sm mt-4 rounded-2xl px-4 py-4 pb-8' >
          <p className='font-semibold text-white ' >{"views : time ago"}</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam, dolor dolorem nulla odio repudiandae reiciendis assumenda voluptatem! Nulla hic rem totam id sequi quasi provident, neque, animi accusamus sit nostrum!
          Deleniti odio ex vitae quasi, sequi deserunt ea voluptate, laudantium mollitia consequatur reiciendis aperiam dicta atque vel incidunt officia culpa accusantium omnis unde eveniet assumenda esse? Sunt veniam rem natus.
          Blanditiis nostrum sit odit maiores expedita similique modi temporibus sapiente explicabo ab architecto, ea, voluptatum qui optio quisquam consequatur? Impedit eius culpa rerum quod porro dolores placeat modi minus. Pariatur.
          Eum dolorem fugit animi praesentium, saepe aut minima. Quia provident aut, dolore enim expedita fugit, eligendi esse ad aspernatur a voluptas asperiores perspiciatis exercitationem. Harum eum dolorum veritatis numquam temporibus.
          Delectus incidunt molestias tempore deserunt eos! Maxime error quibusdam ullam sequi quasi facilis consequuntur porro earum quos, voluptatum veniam dolor dolores fugiat illo voluptates ipsam doloremque ratione odio voluptatibus cum!</p>
        </div>
        <div className='flex flex-col gap-4' >
          <h2 className='text-xl font-bold ' >comments: count</h2>
          <div className='flex gap-4' >
            <div className="w-8 rounded-full">
            <img
                className='w-full rounded-full'
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
            <input 
            className='border-b-2 border-black w-full bg-transparent focus:outline-none pb-2 text-white/80' 
            type="text" placeholder='add a comment...' />
            <button 
            className='btn btn-info rounded-full' 
            type="button"
            disabled={true}
            >comment</button>
          </div>
          <CommentTweetCard type="comment" content="content" />
        </div>
      </div>
      <div className='w-full xl:w-1/3' >
        {/* {
          videos.filter( (video) => (video._id!=videoId)).map( (video) => (
            <VideoCardHorizontal 
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
            channelName={video.owner.name}
            views={video.views}
            timestamp={video.createdAt}
            videoId={video._id}
            />
          ) )
        } */}
      </div>
    </div>
  )
}

export default VideoPage