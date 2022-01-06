import { IncomingMessage } from "http"
import formidable, { Fields, File, Files } from "formidable"
import { Parser, ParseResult, UploadedFiles } from "./types"

export default class implements Parser {
    parse(req: IncomingMessage): Promise<ParseResult> {
        const form = formidable()

        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields: Fields, files: Files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ fields, files: this.convertFiles(files) })
                }
            })
        })
    }

    private convertFiles(uploadedFiles: Files): UploadedFiles {
        const convertedFiles: UploadedFiles = {}

        Object.keys(uploadedFiles).forEach((key: string) => {
            let files = uploadedFiles[key]

            if (!Array.isArray(files)) {
                files = [files]
            }

            files.forEach((file: File) => {
                convertedFiles[key] = {
                    name: file.newFilename,
                    path: file.filepath,
                    size: file.size,
                    mimeType: file.mimetype,
                }
            })
        })

        return convertedFiles
    }
}

