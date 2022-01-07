import { Repository } from "../repositories/types";

export type Rules<T> = {
    [key in keyof T]?: Rule
}

export interface Validator {
    rules(): Rule
    validate<T>(data: T, rules: Rules<T>): void
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
    unique<T>(repository: Repository<T>): Rule
    exists<T>(repository: Repository<T>): Rule
    notIn<T>(options: T[], message?: string): Rule
}
