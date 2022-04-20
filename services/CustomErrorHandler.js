
export default class CustomErrorHandler {

    constructor(status, message) {
        this.status = status
        this.message = message
    }

    static userAlreadyExist(message = 'user already exist...'){
        return new CustomErrorHandler(403, message)
    }

    static serverError(message = 'Internal Server Error'){
        return new CustomErrorHandler(500, message)
    }

    static notFoundError(message = '404!! not Found'){
        return new CustomErrorHandler(404, message)
    }

    static wrongCredentials(message = 'Email or password is Incorrect'){
        return new CustomErrorHandler(409, message)
    }

    static unAuthorized(message = 'unAuthorized Acess...'){
        return new CustomErrorHandler(409, message)
    }
}