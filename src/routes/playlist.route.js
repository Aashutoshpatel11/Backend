import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist} from "../controllers/playlist.controller.js";


const playlistRoute = new Router()

playlistRoute.route("/create-playlist").post(verifyJWT, createPlaylist)
playlistRoute.route("/user-playlists").get(verifyJWT, getUserPlaylists)
playlistRoute.route("/user-playlists/:playId").get(verifyJWT, getPlaylistById)
playlistRoute.route("/add-video/:Id").post(verifyJWT, addVideoToPlaylist)
playlistRoute.route("/remove-video/:Id").delete(verifyJWT, removeVideoFromPlaylist)
playlistRoute.route("/delete/:playId").delete(verifyJWT, deletePlaylist)
playlistRoute.route("/update/:playId").patch(verifyJWT, updatePlaylist)


export{playlistRoute}