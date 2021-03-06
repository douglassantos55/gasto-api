import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import UserModel from "../../models/user"
import { Filters, Repository, Condition } from "../types"
import { Limit, User, UserCreationData } from "../../types"
import { parseFilters, SequelizeFilters } from "./filters"
import { NotFoundError } from "../../errors"

class UserRepository implements Repository<User> {
    filters(): Filters {
        return new SequelizeFilters()
    }

    async all(): Promise<User[]> {
        const users = await UserModel.findAll()
        return users.map((user: UserModel) => user.toJSON())
    }

    async findById(id: string): Promise<User> {
        const item = await UserModel.findByPk(id, { include: "friends" })

        if (!item) {
            throw new NotFoundError("User not found")
        }

        return item.toJSON();
    }

    async findOneBy(condition: Condition<User>): Promise<User> {
        const item = await UserModel.findOne({ where: parseFilters(condition), include: "friends" })

        if (!item) {
            throw new NotFoundError("User not found")
        }

        return item.toJSON();
    }

    async update(data: User, condition: Condition<User>) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }

        await UserModel.update(data, { where: parseFilters(condition) })
        return this.findOneBy(condition)
    }

    async create(data: UserCreationData): Promise<User> {
        const user = await UserModel.create({
            ...data,
            id: randomUUID(),
            password: await bcrypt.hash(data.password, 10)
        })

        return user.toJSON()
    }

    async destroy(condition: Condition<User>): Promise<boolean> {
        const count = await UserModel.destroy({ where: parseFilters(condition) })
        return !!count
    }

    async addFriend(user: User, friend: User): Promise<void> {
        const userModel = await UserModel.findByPk(user.id)
        const friendModel = await UserModel.findByPk(friend.id)

        await userModel.addFriend(friendModel)
    }

    async hasFriend(user: User, friend: User): Promise<boolean> {
        const userModel = await UserModel.findByPk(user.id)
        const friendModel = await UserModel.findByPk(friend.id)

        return userModel.hasFriend(friendModel)
    }

    async getFriends(userId: string): Promise<User[]> {
        const userModel = await UserModel.findByPk(userId)
        return userModel.getFriends()
    }

    async removeFriend(userId: string, friendId: string) {
        const userModel = await UserModel.findByPk(userId)
        return userModel.removeFriend(friendId)
    }

    async getLimits(userId: string, condition: Condition<Limit>): Promise<Limit[]> {
        const userModel = await UserModel.findByPk(userId)
        return userModel.getLimits({ where: parseFilters(condition) })
    }
}

export default new UserRepository()
