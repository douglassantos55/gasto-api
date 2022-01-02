import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { Request, Response, Router } from "express"
import User from "../models/user"
import { UserData } from "../types"
import createValidator from "../validator"

const router = Router()

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
        confirmPassword: validator.rules().required().matches("password"),
    }

    const errors = validator.validate<UserData>(data, rules)

    if (errors !== undefined) {
        return res.status(400).json(errors)
    }

    const user = await User.create({
        ...data,
        id: randomUUID(),
        password: await bcrypt.hash(data.password, 10),
    })
    return res.status(201).json(user)
})

export default router
