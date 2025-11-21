import mongoose, { connect } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler( async(req, res) => {
    const {videoId} = req.params
    console.log("here");

    const comments = await Comment.find({
        video: videoId
    }).populate('owner')

    if( comments.length == 0 ){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "No comments YET",
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "comments fetched successfully",
            
        )
    )
} )

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    const owner = req.user

    if(!content){
        throw new ApiError(
            201, 
            "Content is required to add comment"
        )
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner
    })

    if(!comment){
        throw new ApiError(201, "something went wrong while creating a comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment created successfully",
            
        )
    )

})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body

    if(!content){
        throw new ApiError(
            201, 
            "Content is required to add comment"
        )
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    comment.content = content

    const updatedComment = await comment.save({validateBeforeSave:false})

    if(!updateComment){
        throw new ApiError(401, "Comment not updated due to some reason")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Comment updated successfully",
            updatedComment
        )
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(
            401, "Comment not deleted due to some reason! Please Retry after sometime"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comment deleted successfully",
            comment
        )
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}