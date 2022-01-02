import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { Repository } from "../types"
import UserModel from "../../models/user"
import { User, UserCreationData } from "../../types"

export default class implements Repository<User> {
    all(): Promise<User[]> {
        return UserModel.findAll()
    }

    findByEmail(email: string): Promise<User> {
        return UserModel.findOne({ where: { email }, raw: true })
    }

    async create(data: UserCreationData): Promise<User> {
        return UserModel.create({
            ...data,
            id: randomUUID(),
            password: await bcrypt.hash(data.password, 10)
        })
    }
}
