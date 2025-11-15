import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tweetRoute = new Router()

tweetRoute.route("/create").post(verifyJWT, createTweet)
tweetRoute.route("/all-tweets").get(getAllTweets)
tweetRoute.route("/user-tweets").get(verifyJWT, getUserTweets)
tweetRoute.route("/update-tweets/:tweetId").patch(verifyJWT, updateTweet)
tweetRoute.route("/delete-tweets/:tweetId").delete(verifyJWT, deleteTweet)

export {tweetRoute}