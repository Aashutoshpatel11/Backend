import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

// const getAllVideos = asyncHandler( async(req, res) => {

//     // use paginate v2
//     // 

//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

//     const options = {
//         "page" : page,
//         "limit" : limit,
//         "sort" : {
//             sortBy : sortType
//         }
//     }
 
//     const result = Video.aggregatePaginate(
//         {},
//         options
//     )

//     if( !result ){
//         throw new ApiError(401, "OOPs! NO video found")
//     }

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(
//             200,
//             result,
//             "videos fetched successfully"
//         )
//     )

// } )

const getAllVideos = asyncHandler( async(req, res) => {
    console.log('here');
    
    const videos = await Video.find().populate('owner')
    console.log("VIDEOS");
    console.log(videos);
    

    if(!videos){
        return res
        .status(200)
        .json(
            new ApiResponse(
                "NO video uploaded yet",
                videos
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            "Videos fetched successfully",
            videos
        )
    )
} )

const publishAVideo = asyncHandler( async(req, res) => {
    // get title and description from req.body
    // get video and thumbnail from req.files
    // upload on cloudinary and get url
    // create a video object and creat db for it
    // return response

    const {title, description} = req.body
    console.log(req.files);
    const videoLocalPath = req.files?.["videoFile"][0].path;
    const thumbnailLocalPath = req.files?.["thumbnail"][0].path;

    if( !title || !description || !videoLocalPath || !thumbnailLocalPath ){
        throw new ApiError(
            400, "All fields (title, description, video, thumbnail) are required"
        )
    }

    // console.log("HEREHERE");
    
    
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    // console.log(video);

    if( !video || !thumbnail ){
        throw new ApiError(
            400, "something went wrong while uploading on cloudinary! Retry after sometime"
        )
    }

    const videoObject = await Video.create(
        {
            videoFile: video.url,
            thumbnail: thumbnail.url,
            owner: req.user,
            title,
            description,
            duration: video.duration,
            views: 0,
            isPublished: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoObject,
            "Video publish successfully"
        )
    )

} )

const getVideoById = asyncHandler( async(req, res) => {
    const {videoId} = req.params
    const video = await Video.findById(videoId).populate('owner')

    if(!video){
         throw new ApiError( 401, "video not found" )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video fetched successfully"
        )
    )

} )

const updateVideo = asyncHandler( async(req, res) => {
    // verify user
    // take videoId from params
    // take thumbnail, title, description from req.body
    // get video object from db
    //  update and save

    const {title, description} = req.body
    if( !title || !description ){
        throw new ApiError( 401, "both title and description are required" )
    }

    const {videoId} = req.params
    if( !videoId ){
        throw new ApiError(404, "invalid video id")
    }

    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath){
        throw new ApiError(404, "Thumbnail is required" )
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail) {
        throw new ApiError(401, "thumbnail upload failed on cloudinary")
    }

    const video = await Video.findOneAndUpdate(
        {
            _id: videoId,
            owner: new mongoose.Types.ObjectId(req.user?._id)
        },
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail?.url
            }
        },
        {
            new: true
        }
    )
    
    if( !video ){
        throw new ApiError(404, "db not updated or unauthorised user")
    }
 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video details updated successfully"
        )
    )
} )

const deleteVideo = asyncHandler( async(req, res) => {
    const {videoId} = req.params;
    if(!videoId){
        throw new ApiError(401, "Invalid video id")
    }

    // const video = await Video.findById(videoId)
    // if( !video ){
    //     throw new ApiError(404, "video not found")
    // }
    
    // if( video.owner.toString() !== req.user._id.toString() ){
    //     throw new ApiError(400, "user is unauthorised to perform update operation ")
    // }

    // await Video.findByIdAndDelete(videoId)

    const video = await Video.findOneAndDelete(
        {
            _id: videoId,
            owner: new mongoose.Types.ObjectId(req.user._id) 
        }
    )

    if(!video){
        throw new ApiError(404, "video not found or user is unauthorised to perform delete operation")  
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Video deleted successfully"
        )
    )
} )

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}