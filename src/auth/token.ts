import jwt from "jsonwebtoken"
import { User } from "../types"

export function decodeAccessToken(token: string): User {
    return decodeJWT(token, process.env.ACCESS_TOKEN_SECRET)
}

export function decodeRefreshToken(token: string): User {
    return decodeJWT(token, process.env.REFRESH_TOKEN_SECRET)
}

function decodeJWT(token: string, secret: string): User {
    return jwt.verify(token, secret) as User
}

export function generateRefreshToken(user: User): string {
    return generateJWT(user, "1y", process.env.REFRESH_TOKEN_SECRET)
}

export function generateAccessToken(user: User): string {
    return generateJWT(user, "1m", process.env.ACCESS_TOKEN_SECRET)
}

function generateJWT(user: User, duration: string, secret: string): string {
    return jwt.sign(user, secret, {
        subject: user.id,
        expiresIn: duration,
    })
}

