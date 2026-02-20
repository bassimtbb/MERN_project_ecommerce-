import mongoose from "mongoose";
async function connectDB(uri) {
    try {
        mongoose.set("strictQuery", false);
        const connectionInstance = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
        console.log(`database : ${connectionInstance.connection.name}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
});

export default connectDB;