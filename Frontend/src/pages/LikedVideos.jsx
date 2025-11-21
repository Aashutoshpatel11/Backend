import axios from 'axios';
import React, { useEffect, useState } from 'react'
import VideoCardHorizontal from '../components/VideoCardHorizontal';

function LikedVideos() {
    const [likedVideos, setLikedVideos] = useState([])


// GET LIKED VIDEOS
    const getLikedVideos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/getLikedVideos`, {withCredentials: true})
            console.log("LIKED VIDEOS::",response.data.data);
            if(response){
                setLikedVideos(response.data.data)
            }
            return response
        } catch (error) {
            console.log("GET LIKED VIDEO::ERROR::", error.message);
            throw new Error(error);
        }
    } 

    useEffect( ()=>{
        getLikedVideos()
    }, [] )

  return (
    <div className='w-full h-full p-10 md:px-12 lg:px-14 xl:px-30' >
        {
            likedVideos.map( (item) => (
                <VideoCardHorizontal 
                key={item?.video?._id}
                thumbnail={item?.video?.thumbnail}
                title={item?.video?.title}
                channelName={item?.video?.owner?.username}
                views={item?.video?.views}
                createdAt={item?.video?.createdAt}
                videoId={item?.video?._id}
                duration={item?.video?.duration}
                />
            ) )
        }
    </div>
  )
}

export default LikedVideos