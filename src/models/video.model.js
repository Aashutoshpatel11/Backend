import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema( 
    {

    videoFile: {
        type: String, //Cloudinary URL
        required: true,
    },
    thumbnail: {
        type: String, //Cloudinary URL
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }

    }, {timestamps: true} )

export const Video = Schema.model( "Video", videoSchema );