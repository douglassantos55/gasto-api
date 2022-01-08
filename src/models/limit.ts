import {Model, DataTypes } from "sequelize"
import connection from "./connection"
import { Limit as LimitInterface } from "../types"
import User from "./user"

class Limit extends Model implements LimitInterface {
    declare total: number
    declare month: number
    declare year: number
    declare user_id: string
}

Limit.init({
    total: DataTypes.DECIMAL(15, 2),
    month: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
    },
    year: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
}, {
    sequelize: connection,
    tableName: "limits",
    timestamps: false,
})

User.hasMany(Limit, {
    as: "limits",
    foreignKey: "user_id",
})

Limit.belongsTo(User, {
    as: "user",
    foreignKey: "user_id",
})

export default Limit
