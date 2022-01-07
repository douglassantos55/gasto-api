import validate from "validate.js"
import { Repository } from "../repositories/types";

validate.validators.unique = async function(
    value: string,
    options: { repository: Repository<any> },
    key: string,
) {
    if (await options.repository.findOneBy({ [key]: value })) {
        return "is already being used"
    }
    return undefined
}
