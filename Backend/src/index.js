import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

import connectDb from './db/index.js'
import {app} from './app.js'


connectDb()
.then( ()=>{
    app.listen( process.env.PORT,  ()=>{
        console.log('Listening at PORT: ', process.env.PORT);
    } )
} )
.catch( (error)=>{
    console.log('DB Connection Failed :: ERROR :: ',error);
    throw(error);
} )




























// import express from 'express'
// const app = express()
// const connectDb = async function(){
//     try {
//         await mongoose.connect( `${process.env.DATABASE_URI}/${DB_NAME}` )

//         app.on( error, ()=>{
//             console.log(error);
//             throw error;
//         } )

//         app.listen( process.env.PORT , ()=>{
//             console.log( `Listening at Port ${process.env.PORT}` );
//         } )
//     } catch (error) {
//         console.log(error);
//         throw(error)
//     }
// }

// connectDb();