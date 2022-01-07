import validate from "validate.js"

validate.validators.requiredIfPresent = function(
    value: string,
    options: { field: string, message: string },
    key: string,
    data: object
) {
    if (options.field != undefined) {
        key = options.field
    }

    if (data[key] !== undefined) {
        return validate.single(value, {
            presence: {
                message: options.message,
                allowEmpty: false,
            }
        })
    }

    return undefined
}
