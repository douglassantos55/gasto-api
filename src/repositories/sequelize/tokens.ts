import { Condition, Repository } from "../types"
import { Token } from "../../types"
import TokenModel from "../../models/token"

export default class implements Repository<Token> {
    all(): Promise<Token[]> {
        return TokenModel.findAll()
    }

    async destroy(condition: Condition<Token>): Promise<boolean> {
        const count = await TokenModel.destroy({ where: condition })
        return !!count
    }

    findById(id: string): Promise<Token> {
        return TokenModel.findByPk(id, { raw: true })
    }

    findOneBy(condition: Condition<Token>): Promise<Token> {
        return TokenModel.findOne({ where: condition, raw: true })
    }

    async create(data: Partial<Token>): Promise<Token> {
        return TokenModel.create(data)
    }
}
