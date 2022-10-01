import { ObjectId, FindOneAndUpdateOptions } from 'mongodb';
import { DatabaseHelper } from '../../db';
import { Board, Task } from './models';

export namespace BoardRepository {
    export const collection = 'boards';

    export async function findByUsername(username: string) {
        const db = await DatabaseHelper.requestConnection();
        return await db
            .collection(collection)
            .find({ $or: [ 
                { own: username }, 
                { users: username } 
            ]}).toArray();
    }

    export async function create(board: Board) {
        const db = await DatabaseHelper.requestConnection();
        return await db
            .collection(collection)
            .insertOne(board);
    }

    export async function addUser(boardId: string, owner: string, username: string) {
        const db = await DatabaseHelper.requestConnection();
        return await db
        .collection(collection)
        .findOneAndUpdate(
            { _id: new ObjectId(boardId), owner },
            { $addToSet: { users: username } } as any,
            { returnDocument: 'after' } as FindOneAndUpdateOptions
        );
    }

    export async function createTask(boardId: string, username: string, task: Task) {
        const db = await DatabaseHelper.requestConnection();
        return await db
            .collection(collection)
            .findOneAndUpdate(
                { _id: new ObjectId(boardId), users: username },
                { $push: { tasks: task } } as any,
                { returnDocument: 'after' } as FindOneAndUpdateOptions
            );
    }

    export async function patchTask(boardId: string, index: number, username: string, task: Task) {
        const db = await DatabaseHelper.requestConnection();
        const $set: any = {};
        $set[`tasks.${index}`] = task;
        return await db
            .collection(collection)
            .findOneAndUpdate(
                { _id: new ObjectId(boardId), users: username },
                { $set },
                { returnDocument: 'after' } as FindOneAndUpdateOptions
            );
    }
}