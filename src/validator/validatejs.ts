import validate from "validate.js"
import { Validator, Rule, Rules, Errors } from "./types"

type Constraints = {
    [key: string]: any
}

validate.validators.requiredIfPresent = function(value: string, _options: object, key: string, data: object) {
    if (data[key] !== undefined) {
        return validate.single(value, { presence: { allowEmpty: false } })
    }

    return null
}

class ValidateJsRule implements Rule {
    public constraints: Constraints = {}

    requiredIfPresent(): Rule {
        this.constraints.requiredIfPresent = true
        return this
    }

    email(): Rule {
        this.constraints.email = true
        return this
    }

    min(size: number): Rule {
        this.constraints.length = {
            minimum: size
        }
        return this
    }

    matches(field: string): Rule {
        this.constraints.equality = field
        return this
    }

    required(): Rule {
        this.constraints.presence = {
            allowEmpty: false,
        }

        return this
    }
}

export default class implements Validator {
    rules(): Rule {
        return new ValidateJsRule()
    }

    validate<T>(data: T, rules: Rules<T>): Errors<T> | undefined {
        const constraints = {}

        Object.keys(rules).forEach((field: string) => {
            constraints[field] = rules[field].constraints
        })

        return validate.validate(data, constraints)
    }
}
