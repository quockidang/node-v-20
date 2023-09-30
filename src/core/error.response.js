'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad Request error',
    CONFLICT: 'Conflict error'
}

class ErrorRespone extends Error {
    constructor(message,status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorRespone {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestRequestError extends ErrorRespone {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestRequestError
}