import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Model
} from "sequelize"

import sequelize from "./connection"
import { User as UserInterface } from "../types"

class User extends Model implements UserInterface {
    declare id: string
    declare name: string
    declare email: string
    declare password: string
    declare picture: string
    declare friends?: User[]

    declare addFriend: HasManyAddAssociationMixin<User, number>;
    declare hasFriend: HasManyHasAssociationMixin<User, number>;

}

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
}, {
    sequelize,
    tableName: "users",
    timestamps: false,
})

User.belongsToMany(User, {
    as: "friends",
    foreignKey: "user_id",
    otherKey: "friend_id",
    through: "users_friends",
})

export default User
