import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'


export default function useLike(type, id) {
    const [isLiked, setIsLiked] = useState(false)
    const currentUser = useSelector( (state) => state.auth.userData )
    



    // TOGGLE LIKE
  const toggleLike = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/like/toggle-${type}Like/${id}`,{},{withCredentials:true})
      console.log("Toggle Like Response::", response);
      setIsLiked( !isLiked )
      return response
    } catch (error) {
      console.log("TOGGLE LIKE::ERROR::", error.message);
      throw new Error(error);
    }
  } 

  const checkIsLiked = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/like/getLikedVideos`, {withCredentials:true})
    //   console.log("Liked Videos::", response);
      
      setIsLiked( response.data?.data?.filter( (item) => item.likedBy == currentUser._id && item.video==id ).length )
      return response
    } catch (error) {
      console.log("CHECK IS LIKED::ERROR::", error.message);
      throw new Error(error);
    }
  }

  useEffect( () => {
    checkIsLiked()
  }, [] )

    return {
        isLiked,
        toggleLike
    }
}