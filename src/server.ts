import express, { NextFunction, Request, Response } from "express"
import users from "./routes/users"

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

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
