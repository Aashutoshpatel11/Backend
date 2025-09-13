import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
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
userRoute.route("/avatar").patch(
    verifyJWT,
    upload.single([
        {
            name: "avatar",
            maxcount: 1
        }
    ]),
    updateUserAvatar
)
userRoute.route("/cover-image").patch(
    verifyJWT,
    upload.single([
        {
            name: "coverImage",
            maxcount: 1
        }
    ]) ,
    updateCoverImage
)
userRoute.route("/c/:username").get(verifyJWT, getUserChannelProfile)
userRoute.route("/watch-history").get(verifyJWT, getUserWatchHistory)

export {userRoute}