export interface User {
    id: string
    name: string
    email: string
    password: string
    picture: string
}

export type UserCreationData = User & {
    confirmPassword: string
}

export interface Token {
    user_id: string
    token: string
}

export enum ExpenseType {
    NORMAL = "normal",
    LOAN = "emprestimo",
    PAYMENT = "pagamento",
}

export interface Expense {
    id: string
    date: Date
    description: string
    total: number
    type: ExpenseType
    friend?: User
    payment?: Expense
    user_id: string
    friend_id?: string
    payment_id?: string
}

export interface Limit {
    total: number
    month: number
    year: number
    user_id: string
}
