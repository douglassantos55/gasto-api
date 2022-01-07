import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import users from "./routes/users"
import auth from "./routes/auth"
import expenses from "./routes/expenses"
import errorHandler from "./errors/handler"

dotenv.config()

const port = 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use("/users", users)
app.use("/auth", auth)
app.use("/expenses", expenses)
app.use(errorHandler)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
