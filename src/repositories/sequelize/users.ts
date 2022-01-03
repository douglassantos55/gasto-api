import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import UserModel from "../../models/user"
import { Condition, Repository } from "../types"
import { User, UserCreationData } from "../../types"

export default class implements Repository<User> {
    all(): Promise<User[]> {
        return UserModel.findAll()
    }

    findById(id: string): Promise<User> {
        return UserModel.findByPk(id, { raw: true })
    }

    findOneBy(condition: Condition<User>): Promise<User> {
        return UserModel.findOne({ where: condition, raw: true })
    }

    async destroy(condition: Condition<User>): Promise<boolean> {
        const count = await UserModel.destroy({ where: condition })
        return !!count
    }

    async create(data: UserCreationData): Promise<User> {
        return UserModel.create({
            ...data,
            id: randomUUID(),
            password: await bcrypt.hash(data.password, 10)
        })
    }
}
