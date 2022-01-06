import fs from "fs"
import path from "path"
import { Options, UploadedFile, UploadedFiles } from "./types"

export default class {
    private uploaded: { [key: string]: string } = {}

    unlink(filename: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.exists(path.join(__dirname, filename), (exists: boolean) => {
                if (exists) {
                    fs.unlink(path.join(__dirname, filename), () => {
                        resolve(true)
                    })
                }

                resolve(false)
            })
        })
    }

    upload(files: UploadedFiles, options: Options): Promise<{ [key: string]: string }> {
        return new Promise((resolve, reject) => {
            Object.keys(files).forEach((key: string) => {
                const file: UploadedFile = files[key]
                const config = options[key]

                if (config) {
                    if (file.size > config.size) {
                        return reject("image size is too large")
                    } else if (!config.mimeType.includes(file.mimeType)) {
                        return reject("invalid image type")
                    }
                }

                const uploadPath = path.join(__dirname, config.uploadDir + file.name)

                fs.copyFile(file.path, uploadPath, () => {
                    this.uploaded[key] = config.uploadDir + file.name
                    console.log(`File uploaded to ${uploadPath}`)

                    if (Object.keys(this.uploaded).length === Object.keys(files).length) {
                        resolve(this.uploaded)
                    }
                })
            })
        })
    }
}
