import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken" 

const generateAccessAndRefreshToken = async( userId ) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        
        const refreshToken =  await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async(req, res)=>{
    console.log("registering user...");
    
    // fetch data from frontend -- 
    // validation - non empty --
    // user exist check --
    // multer middleware--
    // file - avatar check--
    // upload on cloudinary--
    // create user object
    // entry on db
    // return res without password and access token

    const {email, username, fullname, password} = req.body

    if( [email, username, fullname, password].some( (field) => field?.trim() ==="" ) ){
        throw new ApiError( 400, "All field are mandatory" )
    }

    const existedUser = await User.findOne({
        $or: [ { email }, { username } ]
    })

    if( existedUser ){
        throw new ApiError( 409, "User with same username or email already exists" );
    }

    const avatarLocalPath = await req.files?.["avatar"][0].path;
    
    // const coverImageLocalPath = await req.files?.["coverImage"][0].path;
    
    let coverImageLocalPath = "";

    if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
        coverImageLocalPath = await req.files?.["coverImage"][0].path;
    }

    if( !avatarLocalPath ){
        throw new ApiError( 400, "Avatar image is required" );
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user = await User.create(
        {
            email, 
            username: username.toLowerCase(), 
            fullname, 
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url || "",
        }
    )

    const createdUser = await User.findById( user._id ).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating a user, PLEASE TRY AGAIN!")
    }

    return res.status(201).json(
        new ApiResponse( 200, createdUser, "user has been Registered" )
    )
    

} ) 

const loginUser = asyncHandler( async(req, res) => {
    // fetch data from frontend
    // validate data
    // store in variable
    // check data with db call if user exist
    // password check
    // generate access and refresh token
    // update refresh token to user db
    // return access token (cookies)

    console.log("Logging in user");

    const {email, username, password} = req.body

    if(!password) throw new ApiError(404, "password is required")

    if(!email && !username ) throw new ApiError(404, "username or email is required")

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if( !user ) throw new ApiError(404, "user not found, please register")

    const isPasswordValid = await user.isPasswordCorrect(password);
    

    if( !isPasswordValid ) throw new ApiError(401, "invalid user credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password ")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie( "accessToken", accessToken, options)
    .cookie( "refreshToken", refreshToken, options )
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged successfully"
        )
    )


} )

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

} )

const refreshAccessToken = asyncHandler( async(req, res) => {
    // -> get refresh token
    // -> decode
    // -> get user
    // -> check user token and db token
    // I.E. if same( regenerate access token ) else()login again
    // -> give response
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;


    if( !incomingRefreshToken ){
        throw new ApiError(401, "unauthorised request" )
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken._id)

        if(!user){
            throw new ApiError(401, "invalid refresh token" )
        }
        
        if( user.refreshToken != incomingRefreshToken ){
            throw new ApiError(401, "refresh token expired or used")
        }

        const { accessToken, newRefreshToken } =  await generateAccessAndRefreshToken( user._id )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    "refreshToken": newRefreshToken
                }
            ),
            "Access token refreshed sucsessfully"
        )

    } catch (error) {
        throw new ApiError( 401, error?.message || "invalid refresh token" )
    }

} )

const changeCurrentPassword = asyncHandler( async(req, res) => {
    // get current and new passwrod
    // get current user
    // verify current password
    // update password
    // update db

    const {currentPassword, newPassword} = req.body

    if( !(currentPassword && newPassword) ){
        throw new ApiError(401, "Please fill all fields")
    }

    const user = await User.findById(req.user?._id)
    console.log(user);
    

    if( !user ){
        throw new ApiError(401, "user not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)

    if( !isPasswordCorrect ){
        throw new ApiError(401, "incorrect password")
    }
    console.log(user.password);
    
    user.password = newPassword;

    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Password Updated Successfully" 
        )
    )

} )

const getCurrentUser = asyncHandler( async(req, res) => {
    // console.log("here");

    // console.log(await req.user);
    

    // if( !req.user ){
    //     throw new ApiError(401, "User not found")
    // }

    // const user = await User.findById( req.user._id );
    // console.log(user);
    
    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            await req.user,
            "User details fetched successfully"
        )
    )
} )

const updateAccountDetails = asyncHandler( async(req, res) => {
    // username, email, fullname
    // get this 3 from req.body
    // req.user
    // get current user
    // update user detailes
    // save

    const{username, email, fullname} = req.body;
    if( !(username || email || fullname) ){
        throw new ApiError(401, "All fields are mandortory")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                username,
                email,
                fullname
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User Details updated successfully"
        )
    )

} )

const updateUserAvatar = asyncHandler( async(req, res) => {
    //  req.file from multer
    // get local path
    // upload on cloudinary and get url
    // update current user and save

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(401, "AVatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new ApiError(401, "something went wrong while uploading avatar file on cloudinary!")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {avatar: avatar?.url}
        },
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Avater updated successfully"
        )
    )

} )

const updateCoverImage = asyncHandler( async(req, res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(401, "CoverImage file is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage){
        throw new ApiError(401, "something went wrong while uploading coverImage file on cloudinary!")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { coverImage: coverImage.url }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Cover image updated successfully"
        )
    )

} )

const getUserChannelProfile = asyncHandler( async(req, res) => {
    const username = req.params;

    if(!username.trim()){
        throw new ApiError(404, "invalid param or username")
    }

    const channel = await User.aggregate(
        [
            {
                $match: {
                    "username": username?.toLowerCase()
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    "subscribers": {
                        $size: "$subscribers"
                    },
                    "subscribedTo": {
                        $size: "$subscribedTo"
                    },
                    "isSubscribed": {
                        $cond: {
                            if: {
                                $in: [ req.user?._id , "$Subscriptions.subscriber" ]
                            } ,
                            then: true ,
                            else: false
                        }
                    }
                }
            }
        ]
    )

    if(!channel){
        throw new ApiError(404, "channel not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

} )

const getUserWatchHistory = asyncHandler( async(req, res) => {
    const user = await User.aggregate(
        [
            {
                $match: {
                    "_id": mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            fullname: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user?.watchHistory,
            "Watch History fetched successfully"
        )
    )
} )

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
}