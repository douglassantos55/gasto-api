import { Validator } from "./types"
import ValidateJsValidator from "./validatejs"

export default function(): Validator {
    return new ValidateJsValidator()
}
