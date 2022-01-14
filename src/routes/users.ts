import { NextFunction, Request, Response, Router } from "express"
import { User, UserCreationData } from "../types"
import validator from "../validator"
import repository from "../repositories/users"
import authMiddleware from "../auth/middleware"
import Uploader from "../uploader"
import tokenRepository from "../repositories/tokens"
import multipartMiddleware from "../uploader/middleware"
import { generateAccessToken, generateRefreshToken } from "../auth/token"

const router = Router()

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as UserCreationData

        const rules = {
            name: validator.rules().required(),
            email: validator.rules().required().email().unique(repository),
            password: validator.rules().required().min(6),
            confirmPassword: validator.rules().required().matches("password"),
        }

        await validator.validate<UserCreationData>(data, rules)

        const user = await repository.create(data)

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await tokenRepository.destroy({ user_id: user.id })
        await tokenRepository.create({ token: refreshToken, user_id: user.id })

        const { password, ...userData } = user
        return res.status(201).json({ user: userData, accessToken, refreshToken })
    } catch (err) {
        next(err)
    }
})

router.put("/", authMiddleware, multipartMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        const rules = {
            name: validator.rules().requiredIfPresent(),
            email: validator.rules().requiredIfPresent().email(),
            oldPassword: validator.rules().requiredIfPresent().matchesHash(req.user.password),
            password: validator.rules().requiredIfPresent("oldPassword").min(6),
            confirmPassword: validator.rules().requiredIfPresent("password").matches("password"),
        }

        await validator.validate<User>(data, rules)

        if (Object.keys(req.files).length !== 0) {
            const uploader = new Uploader()

            const filesUploaded = await uploader.upload(req.files, {
                picture: {
                    size: (1024 * 1024), // 1MB,
                    uploadDir: 'pictures/',
                    mimeType: ["image/jpeg", "image/png"],
                }
            })

            if (filesUploaded.picture) {
                uploader.unlink(req.user.picture)
            }

            data.picture = filesUploaded.picture
        }

        const { password, ...user } = await repository.update(data, { id: req.user.id })
        return res.json(user)
    } catch (err) {
        next(err)
    }
})


export default router
