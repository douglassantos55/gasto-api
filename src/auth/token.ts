import jwt from "jsonwebtoken"
import { User } from "../types"

export function decodeJWT(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET)
}

export function generateJWT(user: User): string {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        subject: user.id,
        expiresIn: "1h",
    })
}

