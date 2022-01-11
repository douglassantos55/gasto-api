import bcrypt from "bcrypt"
import { NextFunction, Request, Response, Router } from "express"
import { AuthenticationError } from "../errors"
import userRepository from "../repositories/users"
import tokenRepository from "../repositories/tokens"
import { decodeRefreshToken, generateAccessToken, generateRefreshToken } from "../auth/token"
import { JsonWebTokenError } from "jsonwebtoken"
import authMiddleware from "../auth/middleware"

const router = Router()

router.get("/user", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(req.user)
    } catch (err) {
        next(err)
    }
})

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = decodeRefreshToken(req.body.refreshToken)

        const user = await userRepository.findById(decoded.id)
        const token = await tokenRepository.findById(req.body.refreshToken)

        if (!token || !user) {
            throw new AuthenticationError("invalid token")
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await tokenRepository.destroy({ token: token.token })
        await tokenRepository.create({ token: refreshToken, user_id: decoded.id })

        return res.json({ user, accessToken, refreshToken })
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            res.sendStatus(401)
        } else {
            next(err)
        }
    }
})

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userRepository.findOneBy({ email: req.body.email })

        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new AuthenticationError("invalid email or password")
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await tokenRepository.destroy({ user_id: user.id })
        await tokenRepository.create({ token: refreshToken, user_id: user.id })

        return res.json({ user, accessToken, refreshToken })
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            res.sendStatus(401)
        } else {
            next(err)
        }
    }
})

export default router
