import { Dialect, Options, Sequelize } from "sequelize"

let options: Options = {
    logging: false,
    dialect: process.env.DATABASE_DIALECT as Dialect,
    host: process.env.DATABASE_HOST,
    storage: process.env.DATABASE_STORAGE,
    port: process.env.DATABASE_PORT as unknown as number,
}

if (process.env.DATABASE_DIALECT === "postgres") {
    options.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

const conn = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    options
)

export default conn
