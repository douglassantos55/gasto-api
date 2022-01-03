import bcrypt from "bcrypt"
import { Request, Response, Router } from "express"
import userRepository from "../repositories/users"
import tokenRepository from "../repositories/tokens"
import { decodeRefreshToken, generateAccessToken, generateRefreshToken } from "../auth/token"

const router = Router()

router.post("/refresh", async (req: Request, res: Response) => {
    try {
        const decoded = decodeRefreshToken(req.body.refreshToken)

        const user = await userRepository.findById(decoded.id)
        const token = await tokenRepository.findById(req.body.refreshToken)

        if (!token || !user) {
            return res.status(400).end("invalid token")
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await tokenRepository.destroy({ token: token.token })
        await tokenRepository.create({ token: refreshToken, user_id: decoded.id })

        return res.json({ user, accessToken, refreshToken })
    } catch (err) {
        return res.sendStatus(403)
    }
})

router.post("/login", async (req: Request, res: Response) => {
    const user = await userRepository.findOneBy({ email: req.body.email })

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(403).end("email or password invalid")
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    if (!accessToken || !refreshToken) {
        return res.status(400).end("could not generate token")
    }

    await tokenRepository.destroy({ user_id: user.id })
    await tokenRepository.create({ token: refreshToken, user_id: user.id })

    return res.json({ user, accessToken, refreshToken })
})

export default router
