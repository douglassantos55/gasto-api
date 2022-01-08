import { NextFunction, Request, Response, Router } from "express"
import { UserCreationData } from "../types"
import validator from "../validator"
import repository from "../repositories/users"

const router = Router()

router.get("/:id/friends", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validator.validate(req.params, {
            id: validator.rules().required().exists(repository)
        })

        res.json(await repository.getFriends(req.params.id))
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
