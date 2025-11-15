import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashboardRouter = new Router()

dashboardRouter.route('/stats/:channelId').get(getChannelStats)
dashboardRouter.route('/videos/:channelId').get(getChannelVideos)

export{
    dashboardRouter
}