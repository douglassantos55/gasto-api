import { NextFunction, Request, Response, Router } from "express"
import { User, UserCreationData } from "../types"
import validator from "../validator"
import repository from "../repositories/users"
import authMiddleware from "../auth/middleware"
import Uploader from "../uploader"
import multipartMiddleware from "../uploader/middleware"
import { ValidationError } from "../errors"

const router = Router()

router.get("/", authMiddleware, async (_req: Request, res: Response) => {
    res.json(await repository.all())
})

router.post("/friends", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        await validator.validate(data, {
            email: validator.rules()
                .required()
                .email()
                .notIn([req.user.email], "^You cannot add yourself as a friend").
                exists(repository),
        })

        const friend = await repository.findOneBy({ email: data.email })

        if (await repository.hasFriend(req.user, friend)) {
            return new ValidationError({ email: ["this user is already your friend"] })
        }

        await repository.addFriend(req.user, friend)
        res.status(201).json(friend)
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
            password: validator.rules().requiredIfPresent().min(6),
            confirmPassword: validator.rules().requiredIfPresent("password").matches("password"),
        }

        await validator.validate<User>(data, rules)

        if (Object.keys(req.files).length !== 0) {
            const uploader = new Uploader()

            const filesUploaded = await uploader.upload(req.files, {
                picture: {
                    size: (1024 * 1024), // 1MB,
                    uploadDir: process.env.UPLOAD_DIR + 'pictures/',
                    mimeType: ["image/jpeg", "image/png"],
                }
            })

            if (filesUploaded.picture) {
                uploader.unlink(req.user.picture)
            }

            data.picture = filesUploaded.picture
        }

        return res.json(await repository.update(data, { id: req.user.id }))
    } catch (err) {
        next(err)
    }
})

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
        return res.status(201).json(user)
    } catch (err) {
        next(err)
    }
})

export default router
