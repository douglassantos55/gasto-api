import { IncomingMessage } from "http"

export type ParseResult = {
    fields: object,
    files: UploadedFiles
}

export interface Parser {
    parse(req: IncomingMessage): Promise<ParseResult>
}

export type UploadedFiles = {
    [key: string]: UploadedFile
}

export type UploadedFile = {
    name: string
    path: string
    size: number
    mimeType: string
}

export type Options = {
    [key: string]: Option
}

export type Option = {
    size: number
    uploadDir: string
    mimeType: string[]
}
