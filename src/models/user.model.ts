import mongoose from "mongoose";

export interface UserModel extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    type: "admin" | "user";
    createAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },
    phone: {
        type: String,
    }
}, { timestamps: true, collection: "users" })

export const UserSchema = mongoose.models.users || mongoose.model("User", schema) 