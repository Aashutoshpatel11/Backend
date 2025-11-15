import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import axios from 'axios'

function HomePage() {
    const [videos, setVideos] = useState([])

    const getAllVideos = async() => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/video/videos`)
        console.log(response);
        
        setVideos(response.data.data)
        
      } catch (error) {
        console.log("Error occured while fetching video :: frontend :: error :: ", error.message);
        throw new Error(error)
      }
    }

    useEffect( () => {
      getAllVideos()
    }, [])

    useEffect( () => {
      console.log(videos)
    }, [videos])

    

  return (
    <div>HomePage</div>
  )
}

export default HomePage