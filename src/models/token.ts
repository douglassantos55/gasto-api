import { DataTypes, Model } from "sequelize"
import User from "./user"
import connection from "./connection"
import { Token as TokenInterface } from "../types"

class Token extends Model implements TokenInterface {
    user_id: string
    token: string
}

Token.init({
    token: {
        primaryKey: true,
        type: DataTypes.STRING,
    }
}, {
    sequelize: connection,
    timestamps: false,
})

Token.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
})

export default Token