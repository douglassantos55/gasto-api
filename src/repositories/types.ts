export interface Repository<T> {
    all(): Promise<T[]>
    create(data: any): Promise<T>
}

