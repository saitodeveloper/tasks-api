import dotenv from 'dotenv';
import express from 'express';
import { errors } from 'celebrate';
import { moganMiddleware } from './logger';

const enableLogger = Boolean(process.env.ENV);

dotenv.config();

const app = express();

if (enableLogger) {
    app.use(moganMiddleware);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import board from './routes/board';
import user from './routes/user';

app.use('/v1/board', board);
app.use('/v1/user', user)

app.use(errors());
app.use(function(err: any, _req: any, res: any, _next: any) {
    const message = err.message;
    const status = err.status ?? 500;
    res.status(status).json({ message })
});

export default app