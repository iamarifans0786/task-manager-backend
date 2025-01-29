import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken'
import { responseStatus } from "../helper/respones";
import { UserSchema } from "../models/user.model";

export async function checkJwt(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if (!token) return responseStatus(res, 404, 'Token not found.', null)

        jwt.verify(token, process.env.jwt_key as string, (err: any, decoded: any) => {
            if (err) return responseStatus(res, 403, 'Invalid Token.', null)
            req.user = decoded
            next();
        })
    } catch (error: any) {
        console.log('Error in jwt auth')
        return responseStatus(res, 500, error.message || 'Something went wrong.', error)
    }
}

export async function checkAdmin(req: Request | any, res: Response, next: NextFunction) {
    try {
        const id = req?.user?._id
        const user = await UserSchema.findById(id)

        if (!user) return responseStatus(res, 404, 'User not found.', null)
        if (user.type !== 'admin') return responseStatus(res, 401, 'Unauthorized access. Admins only.', null)

        next()
    } catch (error: any) {
        console.log('Error in checkAdmin middleware:', error);
        return responseStatus(res, 500, error.message || 'Something went wrong.', error);
    }
}

