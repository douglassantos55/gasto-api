type Errors<T> = {
    [key in keyof T]?: string[]
}

export class ValidationError<T> extends Error {
    public errors: Errors<T>

    constructor(errors: Errors<T>) {
        super()
        this.name = "ValidationError"
        this.errors = errors
    }
}

export class UploadError extends Error {
    public file: string

    constructor(message: string, file: string) {
        super(message)
        this.name = "UploadError"
        this.file = file
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "AuthenticationError"
    }
}
