import { Dialect, Sequelize } from "sequelize"

const conn = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        logging: false,
        dialect: process.env.DATABASE_DIALECT as Dialect,
        host: process.env.DATABASE_HOST,
        storage: process.env.DATABASE_STORAGE,
        port: process.env.DATABASE_PORT as unknown as number,
        dialectOptions: { ssl: true }
    }
)

conn.sync()

export default conn
