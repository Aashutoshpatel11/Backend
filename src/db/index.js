import { DB_NAME } from '../constants.js'
import mongoose from 'mongoose';

const connectDb = async ()=>{
    try {
        const dbConnectioninstance = await mongoose.connect( `${process.env.DATABASE_URI}/${DB_NAME}` );
        console.log( '\nDB Connected :: Hosted At : ', dbConnectioninstance.connection.host, '\n' );
        
    } catch (error) {
        console.log('DB Connection :: ERROR :: ',error);
        process.exit(101);
    }
}

export default connectDb;