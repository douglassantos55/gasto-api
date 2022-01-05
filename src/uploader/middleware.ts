import FormidableParser from "./parser"
import { NextFunction, Request, Response } from "express"

export default async function(req: Request, _res: Response, next: NextFunction) {
    const parser = new FormidableParser()
    const { fields, files } = await parser.parse(req)

    req.files = files
    req.body = fields

    next()
}

