import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import users from "./routes/users"
import auth from "./routes/auth/index"
import expenses from "./routes/expenses"
import limits from "./routes/limits"
import friends from "./routes/friends"
import errorHandler from "./errors/handler"

dotenv.config()

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", auth)
app.use("/users", users)
app.use("/expenses", expenses)
app.use("/friends", friends)
app.use("/limits", limits)
app.use(errorHandler)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
