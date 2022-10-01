import * as crypto from 'crypto';
import * as env from '../environment';
import * as jwt from 'jsonwebtoken';
import { ForbidenError, UnauthorizedError } from  '../errors';

export namespace Auth {
    const privateKey: string = env.value('JWT_KEY', '')

    export const generateToken = (obj: any) => jwt.sign(obj, privateKey, { expiresIn: '1h' })

    export const generateFromToken = (token: string) => {
        try {
            const payload = token.split('.')[1]
            const decoded = Buffer.from(payload, 'base64').toString();
            const obj = JSON.parse(decoded)
            delete obj.iat
            delete obj.exp
            return generateToken(obj)
        } catch (error) {
            return error
        }
    }

    export const authRolesMiddleware = (list: Array<string>) => (req: any, _res: any, next: Function) => {
        const role = req.auth.role
        const hasRole = list.includes(role)
    
        if (hasRole) {
            next()
        } else {
            next(new ForbidenError('Not allowed to proceed'))
        }
    }

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
