import * as crypto from 'crypto';
import * as env from '../environment';
import * as jwt from 'jsonwebtoken';
import { ForbidenError, UnauthorizedError } from  '../errors';

export namespace Auth {
    const privateKey: string = env.value('JWT_KEY', '')

    export const generateToken = (obj: any) => jwt.sign(obj, privateKey, { expiresIn: '1h' })

    export const middlewareAuth = (req: any, _res: any, next: Function) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, privateKey)
            req.auth = decoded
            next()
        } catch (error) {
            next(new UnauthorizedError('User not authorized'))
        }
    }

    export const hashString = async (source: string) => {
        const sha512 = crypto.createHash('sha512');
        return await sha512.update(source, 'utf-8').digest('hex');
    }

    export const hashSaltString = async (source: string) => {
        const salt = Math.random().toString(36).substring(2,12);
        const hash = await hashString(`${source}--@--${salt}`);
        return `${hash}.${salt}`; 
    }

    export const hashSaltValidate = async (source: string, hashSalt: string) => {
        const parts = hashSalt.split('.');

        if (parts.length > 2) {
            return false;
        }

        const hash = parts[0];
        const salt = parts[1];
        const testHash = await hashString(`${source}--@--${salt}`);
        
        return hash === testHash;
    }
}
