import Joi from "joi";

export class Contact {
    text: string = '';
    type: string = '';
}

export class User {
    id: string = '';
    username: string = '';
    name: string = '';
    contacts: Array<Contact> = [];
}

export class UserRegister {
    name: string = '';
    username: string = '';
    password: string = '';

    constructor(user: any) {
        this.username = user.username;
        this.password = user.password;
        this.name = user.name;
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
