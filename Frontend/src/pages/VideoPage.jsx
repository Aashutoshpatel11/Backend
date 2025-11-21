import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import VideoPlayer from '../components/VideoPlayer';
import CommentTweetCard from '../components/CommentTweetCard';
import VideoCardHorizontal from '../components/VideoCardHorizontal';
import GetAllVideos from '../assets/GetAllVideos';
import axios from 'axios';
import {useSelector} from 'react-redux'
import timeAgo from '../utils/TimeAgo';

function VideoPage() {
  const [videosList, setVideosList] = useState([])
  const [currentVideo, setCurrentVideo] = useState({})
  const [subscribedChannels, setSubscribedChannels] = useState([])
  const {videoId} = useParams()
  

  // GET ALL VIDEOS
  const getAllVideosList =  async() => {
    const response = await GetAllVideos()
    setVideosList(response)
  }
  useEffect( () => {
    getAllVideosList()
  } , [] )


  // GET CURRENT VIDEO
  const getCurrentVideo = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/video/${videoId}`)
      // console.log("CURRENT VIDEO::", response.data.data);
      setCurrentVideo(response.data.data)
      const viewIncrementResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/video/viewIncrement/${videoId}`,{},{withCredentials:true})
      
      return response
    } catch (error) {
      console.log("Current Video::ERROR::", error.message);
      throw new Error(error)
    }
  }
  useEffect(()=>{
    getCurrentVideo()
  }, [videoId])
    
  return (
    <div className='  xl:flex w-full h-full p-10 gap-10' >
      <div className='w-full xl:w-2/3' >
        {
          currentVideo.owner?._id && 
          <VideoPlayer 
          videosrc={currentVideo?.videoFile}
          title={currentVideo?.title}
          channelName={currentVideo?.owner?.username}
          likes={"0"}
          videoId={videoId}
          ownerAvatar={currentVideo?.owner?.avatar}
          channelId={currentVideo?.owner?._id}
          // subscribedChannels={subscribedChannels}
          />
        }
        <div className='w-full mb-4 bg-neutral text-white/90 text-sm mt-4 rounded-2xl px-4 py-4 pb-8' >
          <p className='font-semibold text-white mb-2 ' >{currentVideo && `${currentVideo.views} views : ${timeAgo(currentVideo.createdAt)}`}</p>
          <p>description</p>
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
        {
          videosList
          .filter( (video) => {return video._id != videoId})
          .map( (video) => (
            <VideoCardHorizontal 
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
            channelName={video.owner.username}
            views={video.views}
            createdAt={video.createdAt}
            videoId={video._id}
            duration={video.duration}
            />
          ) )
        }
      </div>
    </div>
  )
}

export default VideoPage