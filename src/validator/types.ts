export type Errors<T> = {
    [key in keyof T]?: string[]
}

export type Rules<T> = {
    [key in keyof T]?: Rule
}

export interface Validator {
    rules(): Rule
    validate<T>(data: T, rules: Rules<T>): Errors<T> | undefined
}

export interface Rule {
    date(): Rule
    email(): Rule
    numeric(): Rule
    required(): Rule
    min(size: number): Rule
    in<T>(options: T[]): Rule
    matches(field: string): Rule
    requiredIfPresent(field?: string): Rule
}
