import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { Task, TaskPatch, TaskPost, Board, BoardAddUserPatch } from './models';
import { BoardService } from './service';
import { Auth } from '../../auth';

const router = express.Router();

router.get('/', Auth.middlewareAuth, 
async function(req: any, res, next) {
    try {
        const { username } = req.auth;
        const boards = await BoardService.findByUsername(username);
        return res.status(200).json(boards);
    } catch(error) {
        next(error)
    }
});

router.post('/', Auth.middlewareAuth, celebrate({
    [Segments.BODY]: Board.joiSchema()
}), async function(req: any, res, next) {
    try {
        const { project } = req.body;
        const { username } = req.auth;
        const board = new Board(project, username);
        const result = await BoardService.create(board)
        return res.status(201).json({ id: result.insertedId.toString() });
    } catch(error) {
        next(error)
    }
});

router.post('/:boardId/task', Auth.middlewareAuth, celebrate({
    [Segments.PARAMS]: TaskPost.joiParamSchema(),
    [Segments.BODY]: TaskPost.joiSchema()
}), async function(req: any, res, next) {
    try {
        const { boardId } = req.params;
        const { title, description, status } = req.body;
        const { username } = req.auth;
        const task = new Task(title, description, status);
        const boardResult = await BoardService.createTask(boardId, username, task);
        res.status(200).json(boardResult);
    } catch(error) {
        next(error)
    }
});

router.patch('/:boardId/user/:username', Auth.middlewareAuth, celebrate({
    [Segments.PARAMS]: BoardAddUserPatch.joiParamSchema(),
}), async function(req: any, res, next) {
    try {
        const { boardId, username} = req.params;
        const owner = req.auth.username;
        const result = await BoardService.addUser(boardId, owner, username)
        return res.status(200).json(result);
    } catch(error) {
        next(error)
    }
});

router.patch('/:boardId/task/:index', Auth.middlewareAuth, celebrate({
    [Segments.PARAMS]: TaskPatch.joiParamSchema(),
    [Segments.BODY]: TaskPatch.joiSchema()
}), async function(req: any, res, next) {
    try {
        const { boardId, index } = req.params;
        const { title, description, status } = req.body;
        const { username } = req.auth;
        const task = new Task(title, description, status);
        const boardResult = await BoardService.patchTask(boardId, parseInt(index, 10), username, task);
        res.status(200).json(boardResult);
    } catch(error) {
        next(error)
    }
});

export default router