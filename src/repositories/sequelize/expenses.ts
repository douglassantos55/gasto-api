import sequelize, { Op, WhereOptions } from "sequelize"
import { randomUUID } from "crypto"
import connection from "../../models/connection"
import ExpenseModel from "../../models/expense"
import { Expense } from "../../types"
import { Repository, Condition } from "../types"

// TODO: Research if Sequelize does have a better way to this built-in
const DATE_FORMAT = {
    sqlite: (format: string) => sequelize.fn("strftime", format, sequelize.col("Expense.date")),
    mysql: (format: string) => sequelize.fn("date_format", sequelize.col("Expense.date"), format),
    oracle: (format: string) => {
        let newFormat = format.replace("%", "");
        newFormat = newFormat.padStart((format === "%m" ? 2 : 4), newFormat).toUpperCase()
        return sequelize.fn("to_char", sequelize.col("Expense.date"), newFormat)
    },
}

function parseCondition(condition: Condition<any>): WhereOptions {
    // Remove empty values
    Object.keys(condition).forEach((k: string) =>
        (condition[k] == "" || condition[k] == null) && delete condition[k]
    );

    const where: WhereOptions = { ...condition }
    const func = DATE_FORMAT[connection.getDialect()]

    if (condition.month) {
        where.month = sequelize.where(func("%m"), condition.month.padStart(2, "0"))
    }

    if (condition.year) {
        where.year = sequelize.where(func("%Y"), condition.year)
    }

    if (condition.description) {
        where.description = { [Op.like]: `%${condition.description}%` }
    }

    return where
}

class ExpenseRepository implements Repository<Expense> {
    async all(condition: Condition<any>): Promise<Expense[]> {
        const users = await ExpenseModel.findAll({
            where: parseCondition(condition),
            include: ["friend", "payment"]
        })

        return users.map((user: ExpenseModel) => user.toJSON())
    }

    async findById(id: string): Promise<Expense> {
        const item = await ExpenseModel.findByPk(id, { include: ["friend", "payment"] })
        return item && item.toJSON();
    }

    async findOneBy(condition: Condition<Expense>): Promise<Expense> {
        const item = await ExpenseModel.findOne({ where: condition, include: ["friend", "payment"] })
        return item && item.toJSON();
    }

    async update(data: Expense, condition: Condition<Expense>) {
        await ExpenseModel.update(data, { where: condition })
        return this.findOneBy(condition)
    }

    async create(data: Expense): Promise<Expense> {
        const user = await ExpenseModel.create({
            ...data,
            id: randomUUID(),
        })

        return user.toJSON()
    }

    async destroy(condition: Condition<Expense>): Promise<boolean> {
        const count = await ExpenseModel.destroy({ where: condition })
        return !!count
    }
}

export default new ExpenseRepository()
