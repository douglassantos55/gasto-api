import { Request, Response, Router } from "express"
import { User, UserCreationData } from "../types"
import validator from "../validator"
import repository from "../repositories/users"
import authMiddleware from "../auth/middleware"
import Uploader from "../uploader"
import multipartMiddleware from "../uploader/middleware"

const router = Router()

router.get("/", authMiddleware, async (_req: Request, res: Response) => {
    res.json(await repository.all())
})

router.post("/friends", authMiddleware, async (req: Request, res: Response) => {
    const data = req.body

    const errors = validator.validate(data, {
        email: validator.rules().required().email(),
    })

    if (errors) {
        return res.status(400).json(errors)
    }

    const friend = await repository.findOneBy({ email: data.email })

    if (!friend) {
        return res.status(400).json({ email: "no user found for this email" })
    }

    if (friend.id === req.user.id) {
        return res.status(400).json({ email: "you cannot add yourself as a friend" })
    }

    if (await repository.hasFriend(req.user, friend)) {
        return res.status(400).json({ email: "this user is already your friend" })
    }

    await repository.addFriend(req.user, friend)
    res.status(201).json(friend)
})

router.put("/", authMiddleware, multipartMiddleware, async (req: Request, res: Response) => {
    const data = req.body

    const rules = {
        name: validator.rules().requiredIfPresent(),
        email: validator.rules().requiredIfPresent().email(),
        password: validator.rules().requiredIfPresent().min(6),
        confirmPassword: validator.rules().requiredIfPresent("password").matches("password"),
    }

    let errors = validator.validate<User>(data, rules)

    if (errors) {
        return res.status(400).json(errors)
    }

    if (Object.keys(req.files).length !== 0) {
        try {
            const uploader = new Uploader()

            const filesUploaded = await uploader.upload(req.files, {
                image: {
                    size: (1024 * 1024), // 1MB,
                    uploadDir: process.env.UPLOAD_DIR + 'pictures/',
                    mimeType: ["image/jpeg", "image/png"],
                }
            })

            if (filesUploaded.image) {
                uploader.unlink(req.user.picture)
            }

            data.picture = filesUploaded.image
        } catch (err) {
            return res.status(400).json({ picture: err })
        }
    }

    return res.json(await repository.update(data, { id: req.user.id }))
})

router.post("/", async (req: Request, res: Response) => {
    const data = req.body as UserCreationData

    const rules = {
        name: validator.rules().required(),
        email: validator.rules().required().email(),
        password: validator.rules().required().min(6),
        confirmPassword: validator.rules().required().matches("password"),
    }

    const errors = validator.validate<UserCreationData>(data, rules)

    if (await repository.findOneBy({ email: data.email })) {
        if (!errors.email) {
            errors.email = []
        }

        errors.email.push("this email is already being used")
    }

    if (errors !== undefined) {
        return res.status(400).json(errors)
    }

    const user = await repository.create(data)
    return res.status(201).json(user)
})

export default router
