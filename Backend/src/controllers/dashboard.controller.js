import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    const subscribers = await Subscription.find({channel: channelId})

    const videos = await Video.find({owner: channelId})

    const likes = await Like.find({video: channelId})

    let views = 0
    videos.map( (video) => {
        views += videos.views
    } )

    const stats = {
        "subscribers": subscribers.length,
        "videos": videos.length,
        "likes": likes.length,
        "views": views
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Channels stats fetched successfully",
            stats
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const videos = await Video.find({
        owner: channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Videos fetched successfully",
            videos
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }