import mongoose from "mongoose";
// title, description, userid, status)
export interface TaskModel extends mongoose.Document {
    title: string;
    desc: string;
    user: mongoose.Types.ObjectId;
    status: "Todo" | "In-Progress" | "Completed";
    createAt: Date;
    updatedAt: Date;
}

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["Todo", "In-Progress", "Completed"],
        default: "Todo",
        required: true
    }

}, { timestamps: true, collection: "tasks" })

export const TaskSchema = mongoose.models.tasks || mongoose.model("Task", schema)