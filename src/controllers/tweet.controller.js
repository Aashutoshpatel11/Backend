import asyncHandler from './../utils/asyncHandler.js'
import mongoose from 'mongoose'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Tweet} from '../models/tweet.model.js'

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content){
        throw new ApiError(401, "content is required to create a tweet")
    }

    const tweet = await Tweet.create(
        {
            owner: req.user,
            content
        }
    )
    if(!tweet){
        throw new ApiError(404, "something went wrong while creating a tweet in database")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet is created successfully"
        )
    )

})

const getAllTweets = asyncHandler( async(req, res) => {
    const tweets = await Tweet.find({})
    if(!tweets){
        throw new ApiError(401, "No tweeta posted yet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "tweets fetched successfully"
        )
    )
} )

const getUserTweets = asyncHandler(async (req, res) => {
    console.log(req.user._id)
    
    const tweets = await Tweet.find(
        {
            owner: req.user._id
        }
    )

    if(!tweets.length){
        throw new ApiError(401, "No tweets found for this user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "tweets fetched successfully for this user"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body

    if(!content){
        throw new ApiError(
            "content is mandotory to update a tweet"
        )
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        {
            new: true
        }
    )
    if(!tweet){
        throw new ApiError(401, "something went wrong while updating this tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError("tweet deletion was unsuccessfull");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "tweet deleted successfully"
        )
    )
})

export {
    createTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
    deleteTweet
}