import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";

const subscriptionRouter = new Router()

subscriptionRouter.route('/toggleSubscription/:channelId').post(verifyJWT, toggleSubscription)
subscriptionRouter.route('/getUserChannelSubscribers/:channelId').get(verifyJWT, getUserChannelSubscribers)
subscriptionRouter.route('/getSubscribedChannels/:channelId').get(verifyJWT, getSubscribedChannels)

export{
    subscriptionRouter
}