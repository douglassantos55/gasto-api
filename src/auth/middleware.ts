import { NextFunction, Request, Response } from "express"
import { decodeJWT } from "./token"

export default function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.replace("Bearer", "").trim()
        const decoded = decodeJWT(token)

        // @ts-ignore
        req.user = decoded

        next()
    } catch (err) {
        return res.sendStatus(403)
    }
}
