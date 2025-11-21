import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import HeroSection from '../components/HeroSection/HeroSection'
import GetAllVideos from '../assets/GetAllVideos'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import axios from 'axios'

function HomePage() {
    const [videos, setVideos] = useState([])
    const dispatch = useDispatch()

    const getAllVideos =  async() => {
      const response = await GetAllVideos()
      setVideos(response)
    }

    useEffect( () => {
      getAllVideos()
    }, [])

    // useEffect( () => {
    //   console.log("videos:", videos)
    // }, [videos])

  return (
    <div>
      <HeroSection/>
      <div className='divider' ></div>
      <div className='w-full px-4 sm:px-6 lg:px-8 pb-10' >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' >
        {
          videos.map( (video) => (
            <VideoCard 
            key={video._id} 
            src={video.thumbnail}  
            title={video.title}
            views={Math.floor(video.views)} 
            duration={video.duration}
            channelImageSrc={video.owner.avatar} 
            channelName={video.owner.username}
            videoId={video._id} 
            createdAt={video.createdAt}
            ownerId={video.owner?._id}
            />
          ) )
        }
        </div>
      </div>
      <button onClick={() => getCurrentUser()} className='btn' type="button">get user</button>
    </div>
  )
}

export default HomePage