import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = new Router()

subscriptionRouter.route('/toggleSubscription/:channelId').post(verifyJWT, toggleSubscription)
subscriptionRouter.route('/getUserChannelSubscribers/:channelId').post(verifyJWT, getUserChannelSubscribers)
subscriptionRouter.route('/getSubscribedChannels/:channelId').post(verifyJWT, getSubscribedChannels)

export{
    subscriptionRouter
}