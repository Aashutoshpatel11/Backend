import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler( async(req, res) => {
    const {channelId} = req.param
    const user = req.user

    const subscription = await Subscription.find({
        subscriber: user,
        channel: channelId
    })

    if( subscription ){
        subscription.deleteOne()
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "subscribe button toggled successfully",
                newSubscription
            )
        )
    }else if(!subscription){
        const newSubscription = await Subscription.create({
            subscriber: user,
            channel: channelId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "subscribe button toggled successfully",
                newSubscription
            )
        )
    }
} )

const getUserChannelSubscribers  = asyncHandler( async(req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.find({
        channel: channelId
    })

    if(subscribers.length == 0){
        return res.status(200).json( new ApiResponse( 200, "No channel subscribed yet" ) )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            "subscribed channels fetched successfully",
            subscribers
        )
    )
} )

const getSubscribedChannels  = asyncHandler( async(req, res) => {
    const {channelId} = req.params

    const subscribedChannels = await Subscription.find({
        subscriber: channelId
    })

    if(subscribedChannels.length == 0){
        return res.status(200).json( new ApiResponse( 200, "No channel subscribed yet" ) )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            "subscribed channels fetched successfully",
            subscribedChannels
        )
    )
} )

export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels 
}