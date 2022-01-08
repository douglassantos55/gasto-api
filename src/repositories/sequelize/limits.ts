import { Limit } from "../../types"
import LimitModel from "../../models/limit"
import { Condition, Repository } from "../types"

class LimitRepository implements Repository<Limit> {
    async all(condition: Condition<Limit>): Promise<Limit[]> {
        const tokens = await LimitModel.findAll({ where: condition })
        return tokens.map((token: LimitModel) => token.toJSON())
    }

    async findById(id: string): Promise<Limit> {
        const item = await LimitModel.findByPk(id)
        return item.toJSON();
    }

    async findOneBy(condition: Condition<Limit>): Promise<Limit> {
        const item = await LimitModel.findOne({ where: condition })
        return item.toJSON();
    }

    async update(data: Limit, condition: Condition<Limit>) {
        await LimitModel.update(data, { where: condition })
        return this.findOneBy(condition)
    }

    async create(data: Limit): Promise<Limit> {
        const item = await LimitModel.create(data)
        return item.toJSON()
    }

    async destroy(condition: Condition<Limit>): Promise<boolean> {
        const count = await LimitModel.destroy({ where: condition })
        return !!count
    }
}

export default new LimitRepository()
