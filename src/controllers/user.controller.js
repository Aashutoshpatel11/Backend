import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
    const coverImageLocalPath = await req.files?.["coverImage"][0].path;

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

export {registerUser}