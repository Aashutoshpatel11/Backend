import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription, getChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";

const subscriptionRouter = new Router()

subscriptionRouter.route('/toggleSubscription/:channelId').patch(verifyJWT, toggleSubscription)
subscriptionRouter.route('/getChannelSubscribers/:channelId').get(verifyJWT, getChannelSubscribers)
subscriptionRouter.route('/getSubscribedChannels/:userId').get(verifyJWT, getSubscribedChannels)

export{
    subscriptionRouter
}