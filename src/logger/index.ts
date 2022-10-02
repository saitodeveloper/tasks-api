import morgan from "morgan";
const piiFields = ['password', 'token'];

const getStatusFromHeader = (res: any) => {
    if ((typeof res.headersSent !== 'boolean' && Boolean(res.header)) || res.headersSent) {
        return res.statusCode;
    }
    return null;
}

const getStatusColor = (status: number | null) => {
    if (status === null) {
        /* No color */
        return '\x1b[0m';
    }

    if (status >= 500) {
        /* Red color */
        return '\x1b[31m';
    } else if (status >= 400) {
        /* Yellow color */
        return '\x1b[33m';
    } else if (status >= 300) {
        /* Cyan color */
        return '\x1b[36m';
    } else if (status >= 200) {
        /* Green color */
        return '\x1b[32m';
    } else {
        /* No color */
        return '\x1b[0m';
    }
}

const stringfyBody = (body: any) => {
    if (!body) {
        return '{}';
    }

    Object.keys(body).forEach(key => {
        const isPii = piiFields.includes(key);
        if (isPii) {
            body[`${key}`] = '*****';
        }
    });
    return JSON.stringify(body, null, 2);
}

export const moganMiddleware = morgan(function (tokens, req: any, res: any) {
    const status = getStatusFromHeader(res);
    const color = getStatusColor(status);
    const stringReqBody = stringfyBody(req.body);
    return [
        `${color}${tokens.method(req, res)}`,
        ` ${tokens.status(req, res)}`,
        ` ${tokens.url(req, res)}`,
        ` ${tokens['response-time'](req, res)} ms\n`,
        `Started at: ${req._startTime}\n`,
        `Request: ${stringReqBody} \n\x1b[0m`
    ].join('');
});