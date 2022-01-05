import { NextFunction, Request, Response } from "express"
import { decodeAccessToken } from "./token"

export default function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.replace("Bearer", "").trim()
        const decoded = decodeAccessToken(token)

        req.user = decoded

        next()
    } catch (err) {
        return res.sendStatus(403)
    }
}
