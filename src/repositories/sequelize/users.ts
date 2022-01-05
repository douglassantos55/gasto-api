import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import Repository from "./repository"
import UserModel from "../../models/user"
import { User, UserCreationData } from "../../types"
import { Condition } from "../types"

class UserRepository extends Repository<User> {
    async update(data: User, condition: Condition<User>) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }
        return super.update(data, condition)
    }

    async create(data: UserCreationData): Promise<User> {
        return super.create({
            ...data,
            id: randomUUID(),
            password: await bcrypt.hash(data.password, 10)
        })
    }
}

export default new UserRepository(UserModel)
