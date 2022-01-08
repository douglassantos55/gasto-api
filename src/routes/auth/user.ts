import { NextFunction, Request, Response, Router } from "express"
import { User } from "../../types"
import validator from "../../validator"
import repository from "../../repositories/users"
import authMiddleware from "../../auth/middleware"
import Uploader from "../../uploader"
import multipartMiddleware from "../../uploader/middleware"
import friends from "./friends"

const router = Router()

router.use("/friends", friends)

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

export default router
