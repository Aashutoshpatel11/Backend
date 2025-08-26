import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema( 
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String, //Cloudinary URL
            required: true,
        },
        coverImage: {
            type: String //Cloudinary URL
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId(),
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: true
        },
        refreshToken: {
            type: String
        }

    }, {timestamps: true} );


userSchema.pre( "save", async function (next) {
    if( !this.isModified("password") )  return next();

    this.password = await bcrypt.hash( this.password, 10 );
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password  )
} 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = Schema.model( "User", userSchema );