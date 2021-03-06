import { Model, DataTypes } from "sequelize"
import connection from "./connection"
import UserModel from "./user"
import { Expense as ExpenseInterface, ExpenseType, User } from "../types"

class Expense extends Model implements ExpenseInterface {
    declare id: string
    declare date: Date
    declare description: string
    declare total: number
    declare type: ExpenseType
    declare friend?: User
    declare payment?: ExpenseInterface
    declare user_id: string
    declare friend_id?: string
    declare payment_id?: string
}

Expense.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    date: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    total: DataTypes.DECIMAL(10, 2),
    type: DataTypes.STRING(),
}, {
    tableName: "expenses",
    sequelize: connection,
})

UserModel.hasMany(Expense, {
    as: "expenses",
    foreignKey: "user_id",
})

Expense.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user",
})

Expense.belongsTo(UserModel, {
    foreignKey: "friend_id",
    as: "friend",
})

Expense.hasOne(Expense, {
    foreignKey: "payment_id",
    as: "source",
})

Expense.belongsTo(Expense, {
    as: "payment",
    foreignKey: "payment_id",
})

export default Expense
