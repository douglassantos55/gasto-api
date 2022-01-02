import { Request, Response, Router } from "express"
import { UserCreationData } from "../types"
import createValidator from "../validator"
import repository from "../repositories/users"
import authMiddleware from "../auth/middleware"

const router = Router()

router.get("/", authMiddleware, async (_req: Request, res: Response) => {
    res.json(await repository.all())
})

router.post("/", async (req: Request, res: Response) => {
    const data = req.body as UserCreationData
    const validator = createValidator()

    const rules = {
        name: validator.rules().required(),
        email: validator.rules().required().email(),
        password: validator.rules().required().min(6),
        confirmPassword: validator.rules().required().matches("password"),
    }

    const errors = validator.validate<UserCreationData>(data, rules)

    if (await repository.findByEmail(data.email)) {
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
