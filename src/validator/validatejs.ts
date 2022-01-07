import validate from "validate.js"
import { ValidationError } from "../errors";
import { Repository } from "../repositories/types";
import { Validator, Rule, Rules } from "./types"

import "./exists"
import "./unique"
import "./requiredIfPresent"

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

class ValidateJsRule implements Rule {
    public constraints: Constraints = {}

    unique<T>(repository: Repository<T>): Rule {
        this.constraints.unique = {
            repository
        }

        return this
    }

    exists<T>(repository: Repository<T>): Rule {
        this.constraints.exists = {
            repository
        }
        return this
    }

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

    notIn<T>(options: T[], message?: string): Rule {
        this.constraints.exclusion = {
            within: options,
            message
        }
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

    async validate<T>(data: T, rules: Rules<T>): Promise<void> {
        try {
            const constraints = {}

            Object.keys(rules).forEach((field: string) => {
                constraints[field] = rules[field].constraints
            })

            await validate.async(data, constraints)
        } catch (validationErrors) {
            throw new ValidationError<T>(validationErrors)
        }
    }
}
