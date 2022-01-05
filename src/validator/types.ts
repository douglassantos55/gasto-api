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
    email(): Rule
    required(): Rule
    min(size: number): Rule
    matches(field: string): Rule
    requiredIfPresent(field?: string): Rule
}
