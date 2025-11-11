import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const healthRouter = new Router()

healthRouter.route('/healthcheck').get(healthcheck)

export {
    healthRouter
}