import { Router, Request, Response, NextFunction } from "express"
import { ExpenseType } from "../types"
import validator from "../validator"
import repository from "../repositories/expenses"
import authMiddleware from "../auth/middleware"

const router = Router()

router.get("/debts", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(await repository.all({
            ...req.query,
            type: ExpenseType.LOAN,
            description: repository.filters().like(req.query.description as string),
            month: repository.filters().date(req.query.month as string, "%m"),
            year: repository.filters().date(req.query.year as string, "%Y"),
            friend_id: req.user.id,
            payment_id: null,
        }))
    } catch (err) {
        next(err)
    }
})

router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(await repository.all({
            ...req.query,
            description: repository.filters().like(req.query.description as string),
            month: repository.filters().date(req.query.month as string, "%m"),
            year: repository.filters().date(req.query.year as string, "%Y"),
            user_id: req.user.id
        }))
    } catch (err) {
        next(err)
    }
})

router.get("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json(await repository.findOneBy({
            user_id: req.user.id,
            id: req.params.id,
        }))
    } catch (err) {
        next(err)
    }
})

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        await validator.validate(data, {
            id: validator.rules().requiredIfPresent(),
            description: validator.rules().required(),
            date: validator.rules().required().date(),
            total: validator.rules().required().numeric(),
            friend_id: validator.rules().requiredIfPresent(),
            type: validator.rules().required().in([ExpenseType.NORMAL, ExpenseType.LOAN, ExpenseType.PAYMENT])
        })

        const expense = await repository.create({
            ...data,
            user_id: req.user.id,
        })

        return res.json(expense)
    } catch (error) {
        next(error)
    }
})

router.post("/:id/payment", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validator.validate(req.params, {
            id: validator.rules().required().exists(repository),
        })

        const loan = await repository.findById(req.params.id)

        const payment = await repository.create({
            ...loan,
            date: new Date(),
            type: ExpenseType.PAYMENT,
            user_id: req.user.id,
            friend_id: loan.user_id,
        })

        await repository.update({ ...loan, payment_id: payment.id }, { id: loan.id })

        return res.json(payment)
    } catch (err) {
        next(err)
    }
})

router.put("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body

        await validator.validate(data, {
            description: validator.rules().requiredIfPresent(),
            date: validator.rules().requiredIfPresent().date(),
            total: validator.rules().requiredIfPresent().numeric(),
            friend_id: validator.rules().requiredIfPresent(),
            type: validator.rules().requiredIfPresent().in([ExpenseType.NORMAL, ExpenseType.LOAN, ExpenseType.PAYMENT])
        })

        const expense = await repository.update(data, {
            id: req.params.id,
            user_id: req.user.id
        })

        return res.json(expense)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validator.validate(req.params, {
            id: validator.rules().required().exists(repository),
        })

        await repository.destroy({
            id: req.params.id,
            user_id: req.user.id
        })

        return res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

export default router
