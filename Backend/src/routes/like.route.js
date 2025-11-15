import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const likeRoute = new Router()

likeRoute.route('/toggle-videoLike/:videoId').post(verifyJWT, toggleVideoLike)
likeRoute.route('/toggle-commentLike/:commentId').post(verifyJWT, toggleCommentLike)
likeRoute.route('/toggle-tweetLike/:tweetId').post(verifyJWT, toggleTweetLike)
likeRoute.route('/getLikedVideos').get(verifyJWT, getLikedVideos)

export {likeRoute}