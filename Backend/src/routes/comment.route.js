import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const commentRoute = new Router()

commentRoute.route('/videoComments/:videoId').get(getVideoComments)
commentRoute.route('/addComment/:videoId').post(verifyJWT, addComment)
commentRoute.route('/updateComment/:commentId').patch(verifyJWT, updateComment)
commentRoute.route('/deleteComment/:commentId').delete(verifyJWT, deleteComment)

export {
    commentRoute
}