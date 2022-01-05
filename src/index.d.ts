import { User } from "./types"
import { UploadedFiles } from "./uploader/types"

declare global {
    namespace Express {
        export interface Request {
            files?: UploadedFiles
            user?: User
        }
    }
}
