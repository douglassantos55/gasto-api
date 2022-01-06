import validate from "validate.js"
import { Validator, Rule, Rules, Errors } from "./types"

type Constraints = {
    [key: string]: any
}

type DateOptions = {
    earliest: unknown
    latest: unknown
    dateOnly: boolean
}

// https://validatejs.org/#validators-date
validate.extend(validate.validators.datetime, {
    parse: function(value: unknown, _options: DateOptions) {
        return new Date(value as number);
    },
    format: function(value: number, _options: DateOptions) {
        return new Date(value).toLocaleDateString()
    }
});

validate.validators.requiredIfPresent = function(
    value: string,
    options: { field: string },
    key: string,
    data: object
) {
    if (options.field != undefined) {
        key = options.field
    }

    if (data[key] !== undefined) {
        return validate.single(value, { presence: { allowEmpty: false } })
    }

    return undefined
}

class ValidateJsRule implements Rule {
    public constraints: Constraints = {}

    numeric(): Rule {
        this.constraints.numericality = { strict: true }
        return this
    }

    date(): Rule {
        this.constraints.date = true
        return this
    }

    in<T>(options: T[]): Rule {
        this.constraints.inclusion = options
        return this
    }

    requiredIfPresent(field?: string): Rule {
        this.constraints.requiredIfPresent = {
            field
        }
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
