import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler( async(req, res) => {
    console.log("TOGGLING SUBSCIPTION");
    
    const {channelId} = req.params
    const user = req.user

    const subscription = await Subscription.find({
        subscriber: user._id,
        channel: channelId
    })

    console.log("SUBSCRIPTION", subscription);
    

    if( subscription.length >= 1 ){
        const deletedSubscription = await Subscription.deleteOne({"_id": subscription[0]?._id})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Unsubscribed successfully",
                deletedSubscription
            )
        )
    }else{
        const newSubscription = await Subscription.create({
            subscriber: user,
            channel: channelId
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Subscribed successfully",
                newSubscription
            )
        )
    }
} )

const getChannelSubscribers  = asyncHandler( async(req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.find({
        channel: channelId
    })

    if(subscribers.length == 0){
        return res
        .status(200)
        .json( 
            new ApiResponse( 
                200,
                subscribers,
                "No channel subscribed yet",
                 
            ) 
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "subscribed channels fetched successfully",
            
        )
    )
} )

const getSubscribedChannels  = asyncHandler( async(req, res) => {
    const {userId} = req.params

    const subscribedChannels = await Subscription.find({
        subscriber: userId
    }).populate('owner')

    if(subscribedChannels.length == 0){
        return res
        .status(200)
        .json( 
            new ApiResponse( 
                200,
                [],
                "No channel subscribed yet"
            ) 
        )
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
    getChannelSubscribers,
    getSubscribedChannels 
}