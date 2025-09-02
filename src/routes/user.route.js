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

export {userRoute}