import { Sequelize } from "sequelize"

const conn = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
})

conn.sync()

export default conn
