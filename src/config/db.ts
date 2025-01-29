import mongoose from "mongoose";

export const ConnectionMongoDB = async () => {
    try {
        const mongoUri = process.env.mongodb_url;
        if (!mongoUri) {
            throw new Error("MongoDB connection URL is not defined in environment variables.");
        }
        await mongoose.connect(mongoUri as string)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
