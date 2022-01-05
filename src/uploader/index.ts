import fs from "fs"
import path from "path"
import { UploadedFile, UploadedFiles } from "./types"

export default class {
    private uploaded: { [key: string]: string } = {}

    upload(files: UploadedFiles): Promise<{ [key: string]: string }> {
        return new Promise(resolve => {
            Object.keys(files).forEach((key: string) => {
                const file: UploadedFile = files[key]
                const uploadPath = path.join(__dirname, process.env.UPLOAD_DIR + file.name)

                fs.copyFile(file.path, uploadPath, () => {
                    this.uploaded[key] = process.env.UPLOAD_DIR + file.name
                    console.log(`File uploaded to ${uploadPath}`)

                    if (Object.keys(this.uploaded).length === Object.keys(files).length) {
                        resolve(this.uploaded)
                    }
                })
            })
        })
    }
}
