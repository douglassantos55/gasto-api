import { Repository } from "../repositories/types";

export type Rules<T> = {
    [key in keyof T]?: Rule
}

export interface Validator {
    rules(): Rule
    validate<T>(data: T, rules: Rules<T>): void
}

export interface Rule {
    date(message?: string): Rule
    email(message?: string): Rule
    numeric(message?: string): Rule
    required(message?: string): Rule
    min(size: number, message?: string ): Rule
    in<T>(options: T[], message?: string): Rule
    matches(field: string, message?: string): Rule
    requiredIfPresent(field?: string, message?: string): Rule
    unique<T>(repository: Repository<T>, message?: string): Rule
    exists<T>(repository: Repository<T>, message?: string): Rule
    notIn<T>(options: T[], message?: string): Rule
}
