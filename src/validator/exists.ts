import validate from "validate.js"
import { Repository } from "../repositories/types";

validate.validators.exists = async function(
    value: string,
    options: { repository: Repository<any> },
    key: string
) {
    if (!await options.repository.findOneBy({ [key]: value })) {
        return "does not exist"
    }
    return undefined
}

