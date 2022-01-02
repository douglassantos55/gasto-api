import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { User } from "./types"

export function decodeJWT(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET)
}

export function generateJWT(user: User): string {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        subject: user.id,
        expiresIn: "1h",
    })
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
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
