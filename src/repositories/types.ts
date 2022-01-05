export type Condition<T> = {
    [key in keyof T]?: string
}

export interface Repository<T> {
    all(): Promise<T[]>
    create(data: any): Promise<T>
    findById(id: string): Promise<T>
    findOneBy(condition: Condition<T>): Promise<T>
    destroy(condition: Condition<T>): Promise<boolean>
    update(data: any, condition: Condition<T>): Promise<T>
}

