import { Request, Response, NextFunction, Router } from "express"
import authMiddleware from "../auth/middleware"
import validator from "../validator"
import repository from "../repositories/limits"

const router = Router()

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        await validator.validate(data, {
            total: validator.rules().required().numeric(),
            month: validator.rules().required().numeric(),
            year: validator.rules().required().numeric(),
        })

        res.json(await repository.create({
            ...data,
            user_id: req.user.id
        }))
    } catch (err) {
        next(err)
    }
})

export default router
