import { NextFunction, Request, Response } from "express"
import { AuthenticationError, NotFoundError, UploadError, ValidationError } from "./"

export default function(err: Error, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof ValidationError) {
        return res.status(400).json(err.errors)
    } else if (err instanceof UploadError) {
        return res.status(400).json({ [err.file]: err.message })
    } else if (err instanceof AuthenticationError) {
        return res.status(403).end(err.message)
    } else if (err instanceof NotFoundError) {
        return res.status(404).end(err.message)
    } else {
        return res.status(500).end(err.message)
    }
}

