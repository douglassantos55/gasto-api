import { DataTypes, Model } from "sequelize"
import sequelize from "./connection"
import { User as UserInterface } from "../types"

class User extends Model implements UserInterface {
    id: string
    name: string
    email: string
    password: string
    picture: string
}

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
}, {
    sequelize,
    tableName: "users",
    timestamps: false,
})

export default User
