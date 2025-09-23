import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    

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

export {
    // getAllVideos,
    publishAVideo
}