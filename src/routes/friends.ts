import { NextFunction, Request, Response, Router } from "express"
import validator from "../validator"
import repository from "../repositories/users"
import authMiddleware from "../auth/middleware"
import { ValidationError } from "../errors"

const router = Router()

router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(await repository.getFriends(req.user.id))
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validator.validate(req.params, {
            id: validator.rules().required().exists(repository)
        })

        await repository.removeFriend(req.user.id, req.params.id)
        return res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
            throw new ValidationError({ email: ["this user is already your friend"] })
        }

        await repository.addFriend(req.user, friend)
        res.status(201).json(friend)
    } catch (err) {
        next(err)
    }
})

export default router
