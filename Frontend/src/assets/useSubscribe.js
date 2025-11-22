import axios from 'axios'
import { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

export default function useSubscribe(channelId) {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscribedChannels, setSubscribedChannels] = useState([])
    const [subscriberCount, setSubscriberCount] = useState(0)
    
    const userId = useSelector( (state) => state.auth.userData._id )
    
    
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


    // GET SUBSCRIBED CHANNELS
    const getSubscribedChannels = async() => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subscription/getSubscribedChannels/${userId}`,{withCredentials:true}) 
            if(response){
            setSubscribedChannels(response.data.data)
            } 
            return response.data.data
        }catch (error) {
            console.log("ERROR::GET SUBSCRIBED CHANNELS::", error.message);
            throw new Error(error.message);
        }
    }


    // GET SUBSCRIBERS
    const getSubscribers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subscription/getChannelSubscribers/${channelId}`,{withCredentials:true})

            if( response){
            // console.log("FILTER", response.data.data.filter( (item) => item.subscriber == currentUser._id ).length);
            setIsSubscribed(response.data.data.filter( (item) => item.subscriber == userId ).length)
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
        getSubscribedChannels()
    }, [isSubscribed] )
    return {
        subscriberCount,
        isSubscribed,
        subscribedChannels,
        toggleSubscribe
    }
}