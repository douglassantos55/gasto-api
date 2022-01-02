import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { Repository } from "../types"
import User from "../../models/user"
import { UserCreationData } from "../../types"

export default class implements Repository<User> {
    all(): Promise<User[]> {
        return User.findAll()
    }

    async create(data: UserCreationData): Promise<User> {
        return User.create({
            ...data,
            id: randomUUID(),
            password: await bcrypt.hash(data.password, User.PASSWORD_SALT)
        })
    }
}
