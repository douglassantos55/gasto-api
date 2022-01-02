import { Sequelize } from "sequelize"

const conn = new Sequelize("sqlite::memory:")
conn.sync({ alter: true })

export default conn
