export type UserCreationData = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface User {
    id: string
    name: string
    email: string
    password: string
    picture: string
}
