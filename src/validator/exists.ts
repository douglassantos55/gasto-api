import validate from "validate.js"
import { NotFoundError } from "../errors";
import { Repository } from "../repositories/types";

validate.validators.exists = async function(
    value: string,
    options: { message: string, repository: Repository<any> },
    key: string
) {
    try {
        if (!await options.repository.findOneBy({ [key]: value })) {
            return options.message || "does not exist"
        }

        return undefined
    } catch (err) {
        if (err instanceof NotFoundError) {
            return options.message || "does not exist"
        }

        throw err
    }
}

