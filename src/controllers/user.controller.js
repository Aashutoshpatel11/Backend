import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async( userId ) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        console.log(accessToken);
        
        const refreshToken =  await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async(req, res)=>{
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

    const {email, username, password} = req.body

    if(!password) throw new ApiError(404, "password is required")

    if(!email && !username ) throw new ApiError(404, "username or email is required")

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if( !user ) throw new ApiError(404, "user not found, please register")

    const isPasswordValid = user.isPasswordCorrect(password);

    if( !isPasswordValid ) throw new ApiError(401, "invalid user credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")

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
            $unset: {refreshToken : undefined}
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

    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if( !incomingRefreshToken ){
        throw new ApiError(401, "unauthorised request" )
    }

    try {
        const decodedToken = JsonWebTokenError.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

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
        .cookie( "Access Token", accessToken, options )
        .cookie( "Refresh Token", newRefreshToken, options )
        .json(
            200,
            {
                accessToken, "refreshToken": newRefreshToken,
            },
            "Access token Refreshed Successfully"
        )

    } catch (error) {
        throw new ApiError( 401, error?.message || "invalid refresh token" )
    }

} )

export {
    registerUser,
    loginUser,
    logoutUser
}