import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler( async(req, res) => {
    const user = req.user
    const {videoId} = req.params

    const video = await Video.findById(videoId)

    let like = await Like.findOne({
        likedBy: user,
        video: video 
    })

    console.log("like isssss:    ",like);
    

    if( !like ){
        like = await Like.create({
            likedBy: user,
            video
        })
    }else{
        like = await Like.findByIdAndDelete(like._id)
    }

    if(!like){
        throw new ApiError(
            403,
            "something went wrong"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Video Like toggeled successfully",
            like
        )
    )

} ) 


const toggleCommentLike = asyncHandler( async(req, res) => {
    const user = req.user
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)

    let like = await Like.findOne({
        likedBy: user,
        comment: comment 
    })

    if( !like ){
        like = await Like.create({
            likedBy: user,
            comment
        })
    }else{
        like = await Like.findByIdAndDelete(like._id)
    }

    if(!like){
        throw new ApiError(
            403,
            "something went wrong"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Comment Like toggeled successfully",
            like
        )
    )
} ) 


const toggleTweetLike = asyncHandler( async(req, res) => {
    const user = req.user
    const {tweetId} = req.params

    const tweet = await Tweet.findById(tweetId)

    let like = await Like.findOne({
        likedBy: user,
        tweet: tweet 
    })

    if( !like ){
        like = await Like.create({
            likedBy: user,
            tweet
        })
    }else{
        like = await Like.findByIdAndDelete(like._id)
    }

    if(!like){
        throw new ApiError(
            403,
            "something went wrong"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Tweet Like toggeled successfully",
            like
        )
    )
} ) 


const getLikedVideos = asyncHandler( async(req, res) => {
    const user = req.user

    const likedvideos = await Like.find({
        likedBy: user,
        video: { $ne: null }
    })

    if(!likedvideos){
        throw new ApiError(
            404,
            "No liked videos found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Liked videos fetched successfully",
            likedvideos
        )
    )
} ) 

export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}