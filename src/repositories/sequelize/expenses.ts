import { randomUUID } from "crypto"
import ExpenseModel from "../../models/expense"
import { Expense } from "../../types"
import { Repository, Condition } from "../types"

class ExpenseRepository implements Repository<Expense> {
    async all(condition: Condition<Expense>): Promise<Expense[]> {
        const users = await ExpenseModel.findAll({ where: condition, include: ["friend", "payment"] })
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
