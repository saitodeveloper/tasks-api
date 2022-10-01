import { Board, Task } from "./models";
import { BoardRepository } from "./repository";
import { NotFound } from '../../errors';

export namespace BoardService {
    export async function findByUsername(username: string) {
        return await BoardRepository.findByUsername(username);
    }

    export async function create(board: Board) {
        return await BoardRepository.create(board);
    }

    export async function addUser(boardId: string, owner: string, username: string) {
        const updatedObj = await BoardRepository.addUser(boardId, owner, username);

        if (!updatedObj?.lastErrorObject?.updatedExisting) {
            throw new NotFound("Can't add user to board");
        }

        const json = updatedObj?.value as any;
        const id = json._id.toString();
        delete json._id;
        return {
            id,
            ...json
        }; 
    }

    export async function createTask(boardId: string, username: string, task: Task) {
        const updatedObj = await BoardRepository.createTask(boardId, username, task);
        const json = updatedObj?.value as any;
        const id = json._id.toString();
        delete json._id;
        return {
            id,
            ...json
        };
    }

    export async function patchTask(boardId: string, index: number, username: string, task: Task) {
        const updatedObj = await BoardRepository.patchTask(boardId, index, username, task)
        
        if (!updatedObj?.lastErrorObject?.updatedExisting) {
            throw new NotFound('Not found task');
        }
        
        const json = updatedObj?.value as any
        const id = json._id.toString();
        delete json._id;
        return {
            id,
            ...json
        };
    }
}