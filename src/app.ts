import dotenv from 'dotenv';
import express from 'express';
import { errors } from 'celebrate';
import { moganMiddleware } from './logger';
import createError from 'http-errors';

const enableLogger = Boolean(process.env.ENV);

dotenv.config();

const app = express();

/* Middlewares */
if (enableLogger) {
    app.use(moganMiddleware);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Routes */
import board from './routes/board';
import user from './routes/user';

app.use('/v1/board', board);
app.use('/v1/user', user);

/* Doesn't match 404 */
app.use((_req, _res, next) => {
    next(createError(404));
})

/* Erros Handlers */
app.use(errors());
app.use(function(err: any, _req: any, res: any, _next: any) {
    const message = err.message;
    const status = err.status ?? 500;
    res.status(status).json({ message })
});

export default app