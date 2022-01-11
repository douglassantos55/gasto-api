import bcrypt from "bcrypt"
import validate from "validate.js"

validate.validators.bcryptCompare = async function(
    value: string,
    options: { hash: string, message: string },
) {
    if (!await bcrypt.compare(value, options.hash)) {
        return options.message || "is incorrect"
    }
}
