import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { UserSchema } from './../models/user.model';
import { Request, Response } from "express";
import { responseStatus } from "../helper/respones";
import { Types } from 'mongoose';

export class AuthController {

    register = async (req: Request, res: Response) => {
        try {
            const { name, email, phone, password } = req.body
            const fields = { name, email, phone, password };

            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, null);
            }

            const userExits = await UserSchema.findOne({ email })
            if (userExits) return responseStatus(res, 400, 'Email already exits.', null)

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await UserSchema.create({
                name,
                email,
                phone,
                password: hashedPassword
            })
            const data = newUser.toObject()
            delete data.password

            return responseStatus(res, 201, 'User created successfully.', data)
        } catch (error: any) {
            console.log("Registration error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const fields = { email, password };

            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, null);
            }

            const user = await UserSchema.findOne({ email })
            if (!user) return responseStatus(res, 404, 'User not found.', null)

            const match = await bcrypt.compare(password, user.password)
            if (!match) return responseStatus(res, 400, 'Email or Password is incorrect.', null)

            const token = jwt.sign({ _id: user._id, email: email }, process.env.jwt_key as string)
            const data = user.toObject()
            delete data.password

            return responseStatus(res, 200, 'Logged in successfully.', { token: token, user: data })
        } catch (error: any) {
            console.log("login error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    profile = async (req: Request | any, res: Response) => {
        try {
            const id = req?.user?._id
            const user = await UserSchema.findById(id)
            if (!user) return responseStatus(res, 404, 'User not found.', null)

            const data = user.toObject()
            delete data.password

            return responseStatus(res, 200, 'Profile fetch successfully.', data)
        } catch (error: any) {
            console.log("update error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    getAllUsers = async (req: Request | any, res: Response) => {
        try {
            const user = await UserSchema.find().select("-password")
            if (user.length === 0) return responseStatus(res, 404, 'No users found.', null)

            return responseStatus(res, 200, 'All users fetch successfully.', user)
        } catch (error: any) {
            console.log("Getting all user error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    getUser = async (req: Request | any, res: Response) => {
        try {
            const { id } = req?.query

            if (!id) return responseStatus(res, 404, 'User Id required.', null)
            if (!Types.ObjectId.isValid(id)) return responseStatus(res, 400, 'Invalid User Id.', null)

            const user = await UserSchema.findById(id).select("-password")
            if (!user) return responseStatus(res, 404, 'No user found.', null)

            return responseStatus(res, 200, 'User fetch successfully.', user)
        } catch (error: any) {
            console.log("Getting  user error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            const { name, email, phone, password } = req.body
            const fields = { name, email, phone, password };

            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, []);
            }

            const userExits = await UserSchema.findOne({ email })
            if (userExits) return responseStatus(res, 400, 'Email already exits.', [])
            console.log(userExits)

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await UserSchema.create({
                name,
                email,
                phone,
                password: hashedPassword
            })
            const data = newUser.toObject()
            delete data.password

            return responseStatus(res, 201, 'User created successfully.', data)
        } catch (error: any) {
            console.log("Creating User error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    editUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.query;
            const { name, email, phone } = req.body;
            const fields = { name, email, phone };

            for (const [key, value] of Object.entries(fields)) {
                if (!value) {
                    return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, null);
                }
            }

            const emailExits = await UserSchema.findOne({ email })
            console.log(emailExits)
            if (emailExits) return responseStatus(res, 400, 'Email already exits.', null)

            const user = await UserSchema.findById(id)
            if (!user) {
                return responseStatus(res, 404, 'User not found.', null)
            }

            user.name = name
            user.email = email
            user.phone = phone
            await user.save()

            const data = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            };

            return responseStatus(res, 200, 'User updated successfully.', data)
        } catch (error: any) {
            console.log("Updating User error: ", error);
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }


    update = async (req: Request | any, res: Response) => {
        try {
            const { name, phone } = req.body
            const id = req?.user?._id
            if (!id) return responseStatus(res, 404, 'User Id required.', null)
            if (!Types.ObjectId.isValid(id)) return responseStatus(res, 400, 'Invalid User Id.', null)

            const fields = { name, phone }
            for (const [key, value] of Object.entries(fields)) {
                if (!value) return responseStatus(res, 400, `${key.charAt(0).toUpperCase() + key.slice(1)} is required`, null)
            }

            const user = await UserSchema.findById(id)
            if (!user) return responseStatus(res, 404, 'User not found.', null)

            user.name = name
            user.phone = phone
            await user.save()

            const updatedUser = user.toObject()
            delete updatedUser.password

            return responseStatus(res, 200, 'Profile updated successfully.', updatedUser)
        } catch (error: any) {
            console.log("update error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }

    delete = async (req: Request | any, res: Response) => {
        try {
            const { id } = req?.query

            if (!id) return responseStatus(res, 404, 'User Id required.', null)
            if (!Types.ObjectId.isValid(id)) return responseStatus(res, 400, 'Invalid User Id.', null)

            const user = await UserSchema.findByIdAndDelete(id)
            if (!user) return responseStatus(res, 404, 'User not found.', null)

            return responseStatus(res, 200, 'User deleted successfully.', user)
        } catch (error: any) {
            console.log("update error: ", error)
            return responseStatus(res, 500, error.message || "Something went wrong.", error)
        }
    }
}