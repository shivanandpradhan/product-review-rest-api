import { ValidationError } from "joi"
import { DEBUG } from "../config"
import { CustomErrorHandler } from "../services"

const errorHandler = (err, req, res, next) => {

    let statusCode = 500
    let message = {
        message : 'Internal Server Error',
        ...(DEBUG && { originalMessage : err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 422
        message = {
            message : err.message
        }
    }

    else if (err instanceof CustomErrorHandler) {
        statusCode = err.status,
        message = {
            message : err.message
        }
    }

    res.status(statusCode).json(message)

}

export default errorHandler