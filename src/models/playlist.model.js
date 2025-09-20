import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model.js";
import { Video } from "./video.model.js";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

playlistSchema.plugin(mongooseAggregatePaginate)

export const Playlist = mongoose.model("Playlist", playlistSchema)