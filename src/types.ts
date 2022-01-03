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

export type Token = {
    user_id: string
    token: string
}
