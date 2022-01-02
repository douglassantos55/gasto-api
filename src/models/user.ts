import { DataTypes, Model } from "sequelize"
import sequelize from "./connection"

class User extends Model { }

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
}, {
    sequelize,
    tableName: "users",
    timestamps: false,
})

export default User
