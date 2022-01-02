import bcrypt from "bcrypt"
import { Request, Response, Router } from "express"
import repository from "../repositories/users"
import { generateJWT } from "../auth/token"

const router = Router()

router.post("/login", async (req: Request, res: Response) => {
    const user = await repository.findByEmail(req.body.email)

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(403).end("email or password invalid")
    }

    const token = generateJWT(user)

    if (!token) {
        return res.status(400).end("could not generate token")
    }

    return res.json({ user, token })
})

export default router
