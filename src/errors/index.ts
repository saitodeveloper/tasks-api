export class ForbidenError extends Error {
    status: number = 403;

    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error {
    status: number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class NotFound extends Error {
    status: number = 404;

    constructor(message: string) {
        super(message);
    }
}