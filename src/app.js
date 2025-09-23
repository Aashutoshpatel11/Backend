import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use( cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}) );
app.use( express.json( {limit: "100kb"} ) )
app.use( express.static( "public" ) )
app.use( express.urlencoded( { extended: true, limit: "100kb"  } ) )
app.use( cookieParser() );


// User Routers

import { userRoute } from "./routes/user.route.js";
import { videoRoute } from "./routes/video.route.js";

app.use( "/api/v1/user", userRoute )
app.use( "/api/v1/video", videoRoute )


export  {app};