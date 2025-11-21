import mongoose from "mongoose"
import {User} from '../models/user.model.js'
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js" 

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    const user = await User.findById(channelId)

    const subscribers = await Subscription.find({channel: channelId})

    const videos = await Video.find({owner: channelId})
    // console.log("VIDEOS::", videos);
    

    const result = await Like.aggregate([
    {
        $match: {
        video: { $in: videos.map(v => v._id) }
        }
    },
    {
        $group: {
        _id: null,
        totalLikes: { $sum: 1 }
        }
    }
    ]);

    const likes = result[0]?.totalLikes || 0;


    let views = 0
    videos.map( (video) => {
        views = views + video.views
    } )

    const stats = {
        "subscribers": subscribers.length,
        "videos": videos.length,
        "likes": likes,
        "views": views,
        "channel": user
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            stats,
            "Channels stats fetched successfully",
            
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const videos = await Video.find({
        owner: channelId
    }).populate('owner')

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Videos fetched successfully",
            
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }