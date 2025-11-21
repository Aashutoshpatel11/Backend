import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCardHorizontal from '../components/VideoCardHorizontal';

function HistoryPage() {
    const [watchHistory, setWatchHistory] = useState([])
    const getWatchHistory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/watch-history`, {withCredentials: true})
            console.log("HISTORY::",response.data.data[0].watchHistory);
            if(response){
                setWatchHistory(response.data?.data[0].watchHistory)
            }
            return response
        } catch (error) {
            console.log("GET LIKED VIDEO::ERROR::", error.message);
            throw new Error(error);
        }
    } 

    useEffect( ()=>{
        getWatchHistory()
    }, [] )
  return (
    <div className='w-full h-full p-10 md:px-12 lg:px-14 xl:px-30' >
        <header className="mb-8">
            <h1 className="text-3xl font-extrabold ">
                Watch History
            </h1>
        </header>
        {
            watchHistory && watchHistory.map( (item) => (
                <VideoCardHorizontal 
                key={item._id}
                thumbnail={item.thumbnail}
                title={item.title}
                channelName={item.owner?.username}
                views={Math.floor(item.views)}
                createdAt={item.createdAt}
                videoId={item._id}
                duration={item.duration}
                ownerId={item.owner?._id}
                />
            ) )
        }
    </div>
  )
}

export default HistoryPage