import { Limit } from "../../types"
import LimitModel from "../../models/limit"
import { Filters, Condition, Repository } from "../types"
import { parseFilters, SequelizeFilters } from "./filters"
import { NotFoundError } from "../../errors"

class LimitRepository implements Repository<Limit> {
    filters(): Filters {
        return new SequelizeFilters()
    }

    async all(condition: Condition<Limit>): Promise<Limit[]> {
        const tokens = await LimitModel.findAll({ where: parseFilters(condition) })
        return tokens.map((token: LimitModel) => token.toJSON())
    }

    async findById(id: string): Promise<Limit> {
        const item = await LimitModel.findByPk(id)

        if (!item) {
            throw new NotFoundError("Limit not found")
        }

        return item.toJSON();
    }

    async findOneBy(condition: Condition<Limit>): Promise<Limit> {
        const item = await LimitModel.findOne({ where: parseFilters(condition) })

        if (!item) {
            throw new NotFoundError("Limit not found")
        }

        return item.toJSON();
    }

    async update(data: Limit, condition: Condition<Limit>) {
        await LimitModel.update(data, { where: parseFilters(condition) })
        return this.findOneBy(condition)
    }

    async create(data: Limit): Promise<Limit> {
        const item = await LimitModel.create(data)
        return item.toJSON()
    }

    async destroy(condition: Condition<Limit>): Promise<boolean> {
        const count = await LimitModel.destroy({ where: parseFilters(condition) })
        return !!count
    }
}

export default new LimitRepository()
