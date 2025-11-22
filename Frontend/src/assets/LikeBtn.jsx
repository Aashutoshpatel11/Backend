import React from 'react'
import { TbThumbUp } from "react-icons/tb";
import { TbThumbUpFilled } from "react-icons/tb";
import useLike from './useLike';

function LikeBtn({type, id}) {
    
    const {isLiked, toggleLike} = useLike(type, id)
  return (
    <button 
    onClick={() => toggleLike()}
    className='btn rounded-full btn-md p-2 px-4 text-white bg-base-300 hover:bg-white/10'
    type="button">
        {isLiked? (<TbThumbUpFilled />) : (<TbThumbUp />) }
    </button>
  )
}

export default LikeBtn