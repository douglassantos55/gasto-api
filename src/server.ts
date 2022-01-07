import dotenv from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import users from "./routes/users"
import auth from "./routes/auth"
import expenses from "./routes/expenses"
import { AuthenticationError, UploadError, ValidationError } from "./errors"

dotenv.config()

const port = 3000
const app = express()

app.use(express.json())

app.use("/users", users)
app.use("/auth", auth)
app.use("/expenses", expenses)

app.use(function(err: Error, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof ValidationError) {
        return res.status(400).json(err.errors)
    } else if (err instanceof UploadError) {
        return res.status(400).json({ [err.file]: err.message })
    } else if (err instanceof AuthenticationError) {
        return res.status(403).end(err.message)
    } else {
        return res.status(500).end(err.message)
    }
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
