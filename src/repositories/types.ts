export interface Filter {
    filter(): unknown
}

export type Condition<T> = {
    [key in keyof T]?: string | Filter
}

export interface Filters {
    like(value: string): Filter
    date(value: string, type: string): Filter
}

export interface Repository<T> {
    all(condition?: Condition<T>): Promise<T[]>
    create(data: any): Promise<T>
    findById(id: string): Promise<T>
    findOneBy(condition: Condition<T>): Promise<T>
    destroy(condition: Condition<T>): Promise<boolean>
    update(data: any, condition: Condition<T>): Promise<T>
    filters(): Filters
}

