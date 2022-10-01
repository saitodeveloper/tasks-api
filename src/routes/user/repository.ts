import { DatabaseHelper } from '../../db';
import { UserRegister, UserLogin } from './models';

export namespace UserRepository {   
    export const collection = 'users';

    export async function createUserLogin(user: UserRegister) {
        const db = await DatabaseHelper.requestConnection();
        return await db.collection(collection)
            .insertOne(user);
    }

    export async function findByUsername(user: UserLogin) {
        const db = await DatabaseHelper.requestConnection();
        return await db.collection(collection)
            .findOne({ username: user.username })
    }
}