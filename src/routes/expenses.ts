import { Router, Request, Response } from "express"
import { ExpenseType } from "../types"
import validator from "../validator"
import repository from "../repositories/expenses"
import authMiddleware from "../auth/middleware"

const router = Router()

router.get("/", async (_req: Request, res: Response) => {
    res.json(await repository.all())
})

router.post("/", authMiddleware, async (req: Request, res: Response) => {
    const data = req.body

    const errors = validator.validate(data, {
        id: validator.rules().requiredIfPresent(),
        description: validator.rules().required(),
        date: validator.rules().required().date(),
        total: validator.rules().required().numeric(),
        friend_id: validator.rules().requiredIfPresent(),
        type: validator.rules().required().in([ExpenseType.NORMAL, ExpenseType.LOAN, ExpenseType.PAYMENT])
    })

    if (errors) {
        return res.status(400).json(errors)
    }

    const expense = await repository.create({
        ...data,
        user_id: req.user.id,
    })

    return res.json(expense)
})

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
    const data = req.body

    const errors = validator.validate(data, {
        description: validator.rules().requiredIfPresent(),
        date: validator.rules().requiredIfPresent().date(),
        total: validator.rules().requiredIfPresent().numeric(),
        friend_id: validator.rules().requiredIfPresent(),
        type: validator.rules().requiredIfPresent().in([ExpenseType.NORMAL, ExpenseType.LOAN, ExpenseType.PAYMENT])
    })

    if (errors) {
        return res.status(400).json(errors)
    }

    const expense = await repository.update(data, {
        id: req.params.id,
        user_id: req.user.id
    })

    if (!expense) {
        return res.status(400).json({ error: "could not update expense" })
    }

    return res.json(expense)
})

export default router