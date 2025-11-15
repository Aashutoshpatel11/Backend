import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllVideos,
 } from "../controllers/video.controller.js";

const videoRoute = Router()

videoRoute.route("/videos").get(getAllVideos)
videoRoute.route("/publish-video").post( 
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
videoRoute.route("/:videoId").get( getVideoById )
videoRoute.route("/update-video/:videoId").patch( 
    verifyJWT,
    upload.single("thumbnail"), 
    updateVideo 
)
videoRoute.route("/delete/:videoId").delete(
    verifyJWT,
    deleteVideo
)

export {
    videoRoute
}