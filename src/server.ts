import dotenv from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import users from "./routes/users"
import auth from "./routes/auth"
import expenses from "./routes/expenses"

dotenv.config()

const port = 3000
const app = express()

app.use(express.json())

app.use(async function (_req, _res, next) {
    try {
        next()
    } catch (err) {
        next(err)
    }
})

app.use("/users", users)
app.use("/auth", auth)
app.use("/expenses", expenses)

app.use(function(err: string, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    console.log(err)
    return res.status(500).end("Something hairy happened, aborting...")
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
