import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler( async (req, res) => {
    const {name, description} = req.body
    const user = req.user

    if( !name || !description ){
        throw new ApiError(
            401,
            "name and descripton of playlist are required to create a playlist"
        )
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: user
    })

    if( !playlist ){
        throw new ApiError(
            401,
            "Playlst is not created due to some error"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlist created successfully"
        )
    )

} ) 

const getUserPlaylists = asyncHandler( async (req, res) => {
    const user = req.user

    const playlists = await Playlist.find({
        owner: user._id
    })

    if( !playlists ){
        throw new ApiError(
            401,
            "User has no playlists yet"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Playlists fetched successfully",
            playlists
        )
    )

} )

const getPlaylistById = asyncHandler( async (req, res) => {
    const {playId} = req.params
    console.log(playId);
    
    
    const playlist = await Playlist.findById(playId)

    if(!playlist){
        throw new ApiError(
            401,
            "Playlist not found or may be deleted"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist fetched successfully",
            playlist
        )
    )
} )

const addVideoToPlaylist = asyncHandler( async (req, res) => {
    let {Id} = req.params
    console.log(Ids);
    

    const Ids = Id.split("-")
    console.log(Ids);
    const playId = Ids[0]
    const videoId = Ids[1]
    
    console.log("playId: ", playId, "videoId: ", videoId);
    

    if( !videoId || !playId ){
        throw new ApiError(
            404,
            "both video and playlist Id's are required"
        )
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            401,
            "video not found"
        )
    }

    const playlist = await Playlist.findById(playId)
    if(!playlist){
        throw new ApiError(
            401,
            "playlist not found"
        )
    }

    const existingVideo = playlist.videos.find( (video) => video._id == videoId )

    if(existingVideo){
        throw new ApiError(
            401,
            "playlist already has this video in it"
        )
    }

    playlist.videos.push(video)

    const updatedPlaylist = await playlist.save({
        validateBeforeSave: false
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Playlist updated successsfully",
            updatedPlaylist
        )
    )

} )

const removeVideoFromPlaylist = asyncHandler( async (req, res) => {
    const {Id} = req.params
    const Ids = Id.split("-")
    const playId = Ids[0]
    const videoId = Ids[1]
    
    if( !playId || !videoId ){
        throw new ApiError(
            403,
            "Playlist or Video id is not specified"
        )
    }

    let playlist = await Playlist.findById(playId)
    if(!playlist){
        throw new ApiError(
            402,
            "Playlist not found"
        )
    }    

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            402,
            "video not found"
        )
    }

    playlist.videos = playlist.videos.filter( (v) => v == video  )

    const updatedPlaylist = await playlist.save({
        validateBeforeSave: false
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "video removed successfully",
            updatedPlaylist
        )
    )

} )

const deletePlaylist = asyncHandler( async (req, res) => {
    const {playId} = req.params

    const playlist = await Playlist.findByIdAndDelete(playId)

    if(!playlist){
        401,
        "smomething went wrong while deleting this playlist"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist deleted successfully",
            playlist
        )
    )
} )

const updatePlaylist = asyncHandler( async (req, res) => {
    const {playId} = req.params
    const {name, description} = req.body

    if( !name || !description ){
        throw new ApiError(
            401,
            "both name and description are required"
        )
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playId,
        {
            name,
            description
        },
        {new: true}
    )
    console.log(playlist);
    
    if( !playlist ){
        throw new ApiError(
            401,
            "Something went wrong while updating a playlist"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Playlist updated successfully",
            playlist
        )
    )
} )

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}