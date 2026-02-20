import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./src/routes/user.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import ApiResponse from "./src/utils/apiResponse.js";
import connectDB from "./src/config/database.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./src/config/swagger.js";

dotenv.config();
const EXPRESS_HOST = process.env.EXPRESS_HOST || "localhost";
const PORT = process.env.PORT || 5000;
const app = express();
export const MONGO_USER = process.env.MONGO_USER || "mongo_user";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "example1234";
export const MONGO_HOST = process.env.MONGO_HOST || "127.0.0.1";
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_DB = process.env.MONGO_DB || "test_db";

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});
try {
    console.log("Connecting to MongoDB...");
    await connectDB(MONGO_URI);
} catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
}

app.get("/", (req, res) => {
    // console.log(`${req.method} ${req.path}`);
    // res.send("Hello form Express server!");
    ApiResponse.success(res, "Hello form Express server!", {
        version: "1.0.0",
        endpoints: {
            users: `http://${EXPRESS_HOST}:${PORT}/api/users`,
            products: `http://${EXPRESS_HOST}:${PORT}/api/products`,
            stats: `http://${EXPRESS_HOST}:${PORT}/api/users/stats`,
            mongoExpress: "http://localhost:8081"
        },
        timestamp: new Date().toISOString()
    });
});
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
    ApiResponse.notFound(res, "Not Found", {}, 404);
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    console.log("Server stopped");
    process.exit(0);
});