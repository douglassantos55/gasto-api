import cors from "cors"
import path from "path"
import express from "express"
import users from "./routes/users"
import auth from "./routes/auth"
import expenses from "./routes/expenses"
import limits from "./routes/limits"
import friends from "./routes/friends"
import errorHandler from "./errors/handler"

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use("/static", express.static(path.join(__dirname, process.env.UPLOAD_DIR)))

app.use("/auth", auth)
app.use("/users", users)
app.use("/expenses", expenses)
app.use("/friends", friends)
app.use("/limits", limits)
app.use(errorHandler)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
