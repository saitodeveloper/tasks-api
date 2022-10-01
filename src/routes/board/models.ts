import Joi from 'joi';

export class Task {
    title: string = '';
    description: string = '';
    status: string = '';

    constructor(title: string, description: string, status: string) {
        this.title = title;
        this.description = description;
        this.status = status;
    }
}

export class TaskPost extends Task {

    constructor(title: string, description: string, status: string) {
        super(title, description, status)
    }

    static joiParamSchema = () => Joi.object({
        boardId: Joi.string().hex().length(24).required()
    })

    static joiSchema = () => Joi.object({
        title: Joi.string().min(1).max(30).required(),
        description: Joi.string().min(1).max(999).required(),
        status: Joi.string().valid('To Do', 'In Progress', 'Done', 'Archived').required()
    })
}

export class TaskPatch extends Task {

    constructor(title: string, description: string, status: string) {
        super(title, description, status)
    }

    static joiParamSchema = () => Joi.object({
        boardId: Joi.string().hex().length(24).required(),
        index: Joi.number().min(0).max(999).required()
    })

    static joiSchema = () => Joi.object({
        title: Joi.string().min(1).max(30),
        description: Joi.string().min(1).max(999),
        status: Joi.string()
    })
}

export class BoardAddUserPatch {

    static joiParamSchema = () => Joi.object({
        boardId: Joi.string().hex().length(24).required(),
        username: Joi.string().min(0).max(999).required()
    })
}

export class Board {
    project: string = '';
    owner: string = '';
    tasks: Array<Task> = [];
    users: Array<string> = [];

    constructor(project: string, owner: string) {
        this.project = project;
        this.owner = owner;
        this.users.push(owner);
    }

    static joiSchema = () => Joi.object({
        project: Joi.string().min(1).max(30).required()
    })
}