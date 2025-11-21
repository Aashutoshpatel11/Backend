import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { TbThumbUp } from "react-icons/tb";
import { TbThumbUpFilled } from "react-icons/tb";
import { useSelector } from 'react-redux';

function VideoPlayer({videosrc, title, channelName="user", likes, videoId, ownerAvatar, channelId}) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [subscribedChannels, setSubscribedChannels] = useState([])
  const currentUser = useSelector( (state) => state.auth.userData )


// TOGGLE SUBSCRIPTION BUTTON
  const toggleSubscribe = async() =>{
    try {
        const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/subscription/toggleSubscription/${channelId}`,{}, {withCredentials: true})
        // console.log("toggleSubscribe::RESPONSE::", response);
        
        if(response){
            setIsSubscribed(isSubscribed? false : true )
        }
        return response
    } catch (error) {
        console.log("TOGGLE SUBSCRIBE BUTTON::ERRRO", error.message);
        throw new Error(error.message);
    }
  }

  useEffect( () => {
    if( subscribedChannels.find( (channel) => channel.owner?._id == channelId  ) ){
        setIsSubscribed(true)
    }else{
        setIsSubscribed(false)
    }
  }, [] )

// GET SUBSCRIBERS
  const getSubscribers = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subscription/getChannelSubscribers/${channelId}`,{withCredentials:true})

        if( response){
          // console.log("FILTER", response.data.data.filter( (item) => item.subscriber == currentUser._id ).length);
          setIsSubscribed(response.data.data.filter( (item) => item.subscriber == currentUser._id ).length)
          setSubscriberCount(response.data?.data?.length)
        }
        return response
    } catch (error) {
        console.log("ERROR::GET SUBSCRIBER::", error.message);
        throw new Error(error.message);
    }
  }

  useEffect( ()=>{
    getSubscribers()
  }, [isSubscribed] )

// TOGGLE LIKE
  const toggleLike = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/toggle-videoLike/${videoId}`,{},{withCredentials:true})
      setIsLiked( !isLiked )
      return response
    } catch (error) {
      console.log("TOGGLE LIKE::ERROR::", error.message);
      throw new Error(error);
    }
  } 

  const checkIsLiked = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/getLikedVideos}`, {withCredentials:true})
      setIsLiked( response.data?.data?.filter( (item) => item.likedBy == currentUser._id && item.video==videoId ).length )
      return response
    } catch (error) {
      console.log("CHECK IS LIKED::ERROR::", error.message);
      throw new Error(error);
    }
  }

  useEffect( () => {

  }, [] )

  return (
    <div>
        <video 
        className='w-full h-auto mx-auto rounded-lg shadow-lg bg-black'
        controls 
        src={videosrc}>
        </video>
        <div className='flex flex-col' >
            <h1 className='text-2xl font-semibold mt-4 mb-2'>{title}</h1>
            <div className='flex justify-between gap-2' >
                <div className='flex gap-4 text-sm' >
                    <div className="w-10 rounded-full">
                    <img
                        className='w-full rounded-full'
                        alt="Tailwind CSS Navbar component"
                        src={ownerAvatar} />
                    </div>
                    <div className='flex flex-col h-full p-0 justify-between ' >
                        <p className='font-semibold' >{channelName}</p>
                        <p className='text-white/50' >{subscriberCount}</p>
                    </div>
                    <button
                    className={`btn rounded-full btn-md text-black ${isSubscribed? 'bg-error' : 'bg-white'} hover:bg-white/50`}
                    type="button"
                    onClick={() => toggleSubscribe()}
                    >{isSubscribed? 'Unsubscribe' : 'Subscribe' }</button>
                </div>
                <div>
                    <button 
                    onClick={() => toggleLike()}
                    className='btn rounded-full btn-md p-2 px-4 text-white bg-base-300 hover:bg-white/10'
                    type="button">
                        {isLiked? (<TbThumbUpFilled />) : (<TbThumbUp />) }
                        </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default VideoPlayer