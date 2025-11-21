import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler ( async( req, _, next ) => {
    // console.log("cookies", req.cookies);
    const token = await req.cookies?.accessToken 
    // console.log("TOKEN::",req.cookies.accessToken);
    
    if( !token ){
        throw new ApiError(404, "unauthorised request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 

    const user = await User.findById(decodedToken._id).select("-password -refreshtoken")

    if(!user){
        throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next()
} )