import { Token } from "../../types"
import TokenModel from "../../models/token"
import { Condition, Repository } from "../types"

class TokenRepository implements Repository<Token> {
    async all(): Promise<Token[]> {
        const tokens = await TokenModel.findAll()
        return tokens.map((token: TokenModel) => token.toJSON())
    }

    async findById(id: string): Promise<Token> {
        const item = await TokenModel.findByPk(id)
        return item.toJSON();
    }

    async findOneBy(condition: Condition<Token>): Promise<Token> {
        const item = await TokenModel.findOne({ where: condition })
        return item.toJSON();
    }

    async update(data: Token, condition: Condition<Token>) {
        await TokenModel.update(data, { where: condition })
        return this.findOneBy(condition)
    }

    async create(data: Token): Promise<Token> {
        const item = await TokenModel.create(data)
        return item.toJSON()
    }

    async destroy(condition: Condition<Token>): Promise<boolean> {
        const count = await TokenModel.destroy({ where: condition })
        return !!count
    }
}

export default new TokenRepository()
