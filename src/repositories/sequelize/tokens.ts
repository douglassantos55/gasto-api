import { Token } from "../../types"
import Repository from "./repository"
import TokenModel from "../../models/token"

export default new Repository<Token>(TokenModel)
