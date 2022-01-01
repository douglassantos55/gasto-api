import createValidator from "../validator"
import { Request, Response, Router } from "express"

const router = Router()

type UserData = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

router.get("/", (_req: Request, res: Response) => {
    res.end("users endpoint")
})

router.post("/", async (req: Request, res: Response) => {
    const data = req.body as UserData
    const validator = createValidator()

    const rules = {
        name: validator.rules().required(),
        email: validator.rules().required().email(),
        password: validator.rules().required().min(6),
        confirmPassword: validator.rules().matches("password"),
    }

    const errors = validator.validate<UserData>(data, rules)

    if (errors !== undefined) {
        return res.status(400).json(errors)
    }

    return res.status(201).json(data)
})

export default router
