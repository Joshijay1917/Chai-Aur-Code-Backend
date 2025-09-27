import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInterface = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connected to MongoDB !!! Host name: ", connectionInterface.connection.host);
    } catch (error) {
        console.log("MongoDB connection error ", error);
        process.exit(1);
    }
}

export { connectDB }