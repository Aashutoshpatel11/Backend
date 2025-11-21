import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory,   
    addVideoToWatchHistory

} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRoute = Router()

userRoute.route( "/register").post(
    upload.fields([
        {
            name: "avatar",
            maxcount: 1
        },
        {
            name: "coverImage",
            maxcount: 1
        }
    ]),
    registerUser
)
userRoute.route("/login").post(loginUser)

// secure route
userRoute.route("/logout").post(verifyJWT, logoutUser)
userRoute.route("/refresh-token").post(verifyJWT, refreshAccessToken)
userRoute.route("/changeCurrentPassword").patch(verifyJWT, changeCurrentPassword)
userRoute.route("/current-user").get(verifyJWT, getCurrentUser)
userRoute.route("/update-account").patch(verifyJWT, updateAccountDetails)
userRoute.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
userRoute.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
userRoute.route("/c/:username").get(verifyJWT, getUserChannelProfile)
userRoute.route("/watch-history").get(verifyJWT, getUserWatchHistory)
userRoute.route("/add-to-watch-history/:videoId").get(verifyJWT, addVideoToWatchHistory )
 
export {userRoute}