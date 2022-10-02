import { DatabaseHelper } from '../../db';
import { UserRegister, UserLogin } from './models';
import { DuplicateError } from '../../errors';

export namespace UserRepository {   
    export const collection = 'users';

    export async function createUserLogin(user: UserRegister) {
        try {
            const db = await DatabaseHelper.requestConnection();
            return await db.collection(collection)
                .insertOne(user);
        } catch(error: any) {
            if (error?.code !== null && error?.code === 11000) {
                throw new DuplicateError('Username already taken');
            } else {
                throw error;
            }
        }
    }

    export async function findByUsername(user: UserLogin) {
        const db = await DatabaseHelper.requestConnection();
        return await db.collection(collection)
            .findOne({ username: user.username })
    }
}