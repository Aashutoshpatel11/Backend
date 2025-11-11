import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller";

const dashboardRouter = new Router()

dashboardRouter.route('/stats/:channelId').get(getChannelStats)
dashboardRouter.router('/videos/:channelId').get(getChannelVideos)

export{
    dashboardRouter
}