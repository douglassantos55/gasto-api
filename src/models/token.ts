import { DataTypes, Model } from "sequelize"
import User from "./user"
import connection from "./connection"
import { Token as TokenInterface } from "../types"

class Token extends Model implements TokenInterface {
    declare user_id: string
    declare token: string
}

Token.init({
    token: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "tokens",
    sequelize: connection,
    timestamps: false,
})

Token.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
})

export default Token
