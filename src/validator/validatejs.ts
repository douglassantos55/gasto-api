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

    unique<T>(repository: Repository<T>, message?: string): Rule {
        this.constraints.unique = {
            repository,
            message,
        }

        return this
    }

    exists<T>(repository: Repository<T>, message?: string): Rule {
        this.constraints.exists = {
            repository,
            message,
        }
        return this
    }

    numeric(message?: string): Rule {
        this.constraints.numericality = {
            strict: true,
            message,
        }
        return this
    }

    date(message?: string): Rule {
        this.constraints.date = {
            message,
        }
        return this
    }

    in<T>(options: T[], message?: string): Rule {
        this.constraints.inclusion = {
            within: options,
            message,
        }
        return this
    }

    notIn<T>(options: T[], message?: string): Rule {
        this.constraints.exclusion = {
            within: options,
            message,
        }
        return this
    }

    requiredIfPresent(field?: string, message?: string): Rule {
        this.constraints.requiredIfPresent = {
            field,
            message,
        }
        return this
    }

    email(message?: string): Rule {
        this.constraints.email = {
            message,
        }
        return this
    }

    min(size: number, message?: string): Rule {
        this.constraints.length = {
            minimum: size,
            message,
        }
        return this
    }

    matches(field: string, message?: string): Rule {
        this.constraints.equality = {
            attribute: field,
            message,
        }
        return this
    }

    required(message?: string): Rule {
        this.constraints.presence = {
            allowEmpty: false,
            message,
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
