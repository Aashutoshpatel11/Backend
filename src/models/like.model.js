import mongoose, {Schema} from "mongoose";
import { User } from "./user.model.js";
import { Video } from "./video.model.js";
import { Comment } from "./comment.model.js";
import { Tweet } from "./tweet.model.js";

const likeSchema = new Schema(
    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like", likeSchema)