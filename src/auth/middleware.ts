import { NextFunction, Request, Response } from "express"
import { decodeAccessToken } from "./token"
import userRepository from "../repositories/users"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization.replace("Bearer", "").trim()
        const decoded = decodeAccessToken(token)

        req.user = await userRepository.findById(decoded.id)

        next()
    } catch (err) {
        return res.sendStatus(403)
    }
}
