import express from "express"
import users from "./routes/users"

const port = 3000
const app = express()

app.use(express.json())
app.use("/users", users)

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
