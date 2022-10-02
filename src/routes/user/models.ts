import Joi from "joi";

export class User {
    id: string = '';
    username: string = '';
    password: string = '';
    name: string = '';

    constructor(username: string, password: string, name: string) {
        this.username = username;
        this.password = password;
        this.name = name;
    }
}

export class UserRegister extends User {

    constructor(username: string, password: string, name: string) {
        super(username, password, name);
    }

    static joiSchema = () => Joi.object({
        username: Joi.string().max(30).required(),
        password: Joi.string().max(30).required(),
        name: Joi.string().max(30).required()
    });
}

export class UserLogin {
    username: string = '';
    password: string = '';

    constructor(user: any) {
        this.username = user.username;
        this.password = user.password;
    }

    static joiSchema = () => Joi.object({
        username: Joi.string().max(30).required(),
        password: Joi.string().max(30).required()
    });
}
