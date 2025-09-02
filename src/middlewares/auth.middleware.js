import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler ( async( req, _, next ) => {
    const token = req.cookies?.accessToken || req.header("Autherization").replace("Bearer ", "")
    
    if( !token ){
        throw ApiError(401, "unauthorised request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 

    const user = User.findById(decodedToken._id).select("-password -refreshtoken")

    if(!user){
        throw new ApiError(4010, "Invalid Access Token");
    }

    req.user = user;
    next()
} )