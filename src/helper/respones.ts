import { Response } from "express";

export const responseStatus = (res: Response, status: number, message: string, data: any) => {
    if (status === 200) res.status(status).json({ statusMessage: "Success", status, success: true, message, data })
    else if (status === 500) res.status(status).json({ statusMessage: "Error", status, success: false, message, data })
    else if (status === 400) res.status(status).json({ statusMessage: "Bad Request", status, success: false, message, data })
    else if (status === 204) res.status(status).json({ statusMessage: "No Content", status, success: false, message, data })
    else if (status === 403) res.status(status).json({ statusMessage: "Forbidden", status, success: false, message, data })
    else if (status === 401) res.status(status).json({ statusMessage: "Unauthorized", status, success: false, message, data })
    else if (status === 404) res.status(status).json({ statusMessage: "Not Found", status, success: false, message, data })
    else res.status(status).json({ statusMessage: "Success", status, success: true, message, data })
}