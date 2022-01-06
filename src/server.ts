import dotenv from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import users from "./routes/users"
import auth from "./routes/auth"
import expenses from "./routes/expenses"

dotenv.config()

const port = 3000
const app = express()

app.use(express.json())

app.use(function (_req: Request, res: Response, next: NextFunction) {
    try {
        next()
    } catch (error) {
        res.status(500).end("Something hairy happened, aborting...")
    }
})

app.use("/users", users)
app.use("/auth", auth)
app.use("/expenses", expenses)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
