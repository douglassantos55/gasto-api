import { Model } from "sequelize"
import { Condition, Repository } from "../types"

export default class <T> implements Repository<T> {
    private model: typeof Model

    constructor(model: typeof Model) {
        this.model = model
    }

    all(): Promise<T[]> {
        // @ts-ignore
        return this.model.findAll()
    }

    findById(id: string): Promise<T> {
        // @ts-ignore
        return this.model.findByPk(id, { raw: true })
    }

    findOneBy(condition: Condition<T>): Promise<T> {
        // @ts-ignore
        return this.model.findOne({ where: condition, raw: true })
    }

    async destroy(condition: Condition<T>): Promise<boolean> {
        // @ts-ignore
        const count = await this.model.destroy({ where: condition })
        return !!count
    }

    async create(data: any): Promise<T> {
        // @ts-ignore
        return this.model.create(data)
    }
}

