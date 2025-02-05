import { Request, Response } from "express";
import { responseStatus } from "../helper/respones";
import { TaskSchema } from "../models/task.model";
import { Types } from "mongoose";

export class TaskController {

    create = async (req: Request, res: Response) => {
        try {
            const { title, desc, user } = req.body
            const fields = { title, desc, user }

            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, [])
            }

            const taskExits = await TaskSchema.findOne({ title })
            if (taskExits) return responseStatus(res, 400, 'Task with this title already exists.', [])

            const task = await TaskSchema.create({
                title,
                desc,
                user
            })

            return responseStatus(res, 201, 'Task created successfully.', task)
        } catch (error: any) {
            console.log("Task create error: ", error);
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    };

    getTask = async (req: Request | any, res: Response) => {
        try {
            const id = req?.user?._id

            const tasks = await TaskSchema.find({ user: id })
            if (tasks.length === 0) return responseStatus(res, 200, 'No tasks found.', [])

            return responseStatus(res, 200, 'Task fetch successfully.', tasks);
        } catch (error: any) {
            console.log("Task create error: ", error);
            return responseStatus(res, 500, error.message || "Something went wrong.", error);
        }
    };

    getAllTask = async (req: Request | any, res: Response) => {
        try {
            const tasks = await TaskSchema.find().populate('user', 'email name phone')
            if (tasks.length === 0) return responseStatus(res, 200, 'No tasks found.', [])

            return responseStatus(res, 200, 'Task fetch successfully.', tasks);
        } catch (error: any) {
            console.log("Task create error: ", error);
            return responseStatus(res, 500, error.message || "Something went wrong.", error);
        }
    };

    getTaskById = async (req: Request | any, res: Response) => {
        try {
            const { id } = req?.query

            if (!id) return responseStatus(res, 404, 'Task Id required.', [])
            if (!Types.ObjectId.isValid(id)) return responseStatus(res, 400, 'Invalid Task Id.', [])

            const task = await TaskSchema.findById(id).populate('user', 'email name phone')
            if (!task) return responseStatus(res, 404, 'No task found.', [])

            return responseStatus(res, 200, 'Task fetch successfully.', task);
        } catch (error: any) {
            console.log("Task create error: ", error);
            return responseStatus(res, 500, error.message || "Something went wrong.", error);
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { title, desc, user, status } = req.body
            const { id } = req.query
            if (!id) return responseStatus(res, 404, 'Task Id required.', [])
            if (!Types.ObjectId.isValid(id as string)) return responseStatus(res, 400, 'Invalid Task Id.', [])

            const fields = { title, desc, user, status }
            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, [])
            }

            const task = await TaskSchema.findByIdAndUpdate(id, { title, desc, user, status }, { new: true })
            if (!task) return responseStatus(res, 404, 'No task found.', null)

            return responseStatus(res, 201, 'Task Updated successfully.', task)
        } catch (error: any) {
            console.log("Task create error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            if (!status) return responseStatus(res, 400, 'Status is required.', [])

            const { id } = req.query
            if (!id) return responseStatus(res, 404, 'Task Id required.', [])
            if (!Types.ObjectId.isValid(id as string)) return responseStatus(res, 400, 'Invalid Task Id.', [])

            const task = await TaskSchema.findByIdAndUpdate(id, { status }, { new: true })
            if (!task) return responseStatus(res, 404, 'No task found.', null)

            return responseStatus(res, 201, 'Status Updated successfully.', task)
        } catch (error: any) {
            console.log("Task status update error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    };


    delete = async (req: Request | any, res: Response) => {
        try {
            const { id } = req?.query

            if (!id) return responseStatus(res, 404, 'Task Id required.', [])
            if (!Types.ObjectId.isValid(id)) return responseStatus(res, 400, 'Invalid Task Id.', [])

            const user = await TaskSchema.findByIdAndDelete(id)
            if (!user) return responseStatus(res, 404, 'Task not found.', [])

            return responseStatus(res, 200, 'Task deleted successfully.', user)
        } catch (error: any) {
            console.log("update error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

}