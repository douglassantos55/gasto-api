import { randomUUID } from "crypto"
import { parseFilters, SequelizeFilters } from "./filters"
import ExpenseModel from "../../models/expense"
import { Expense } from "../../types"
import { Repository, Condition, Filters } from "../types"
import { NotFoundError } from "../../errors"

class ExpenseRepository implements Repository<Expense> {
    filters(): Filters {
        return new SequelizeFilters()
    }

    async all(condition: Condition<any>): Promise<Expense[]> {
        const users = await ExpenseModel.findAll({
            where: parseFilters(condition),
            include: ["friend", "payment"],
            order: [["createdAt", "DESC"]],
        })

        return users.map((user: ExpenseModel) => user.toJSON())
    }

    async findById(id: string): Promise<Expense> {
        const item = await ExpenseModel.findByPk(id, { include: ["friend", "payment"] })

        if (!item) {
            throw new NotFoundError("Expense not found")
        }

        return item.toJSON();
    }

    async findOneBy(condition: Condition<Expense>): Promise<Expense> {
        const item = await ExpenseModel.findOne({ where: parseFilters(condition), include: ["friend", "payment"] })

        if (!item) {
            throw new NotFoundError("Expense not found")
        }

        return item.toJSON();
    }

    async update(data: Expense, condition: Condition<Expense>) {
        await ExpenseModel.update(data, { where: parseFilters(condition) })
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
        const count = await ExpenseModel.destroy({ where: parseFilters(condition) })
        return !!count
    }
}

export default new ExpenseRepository()
