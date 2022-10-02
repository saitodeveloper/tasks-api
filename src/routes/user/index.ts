import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { UserLogin, UserRegister } from './models';
import { UserService } from './service';

const router = express.Router();

router.post('/', celebrate({
    [Segments.BODY]: UserRegister.joiSchema()
}), async function(req, res, next) {
    try {
        const { username, password, name } = req.body;
        const userRegister = new UserRegister(username, password, name);
        const result = await UserService.createUserLogin(userRegister);
        return res.status(201).json({ id: result?.insertedId.toString() });
    } catch(error) {
        next(error)
    }
});

router.post('/login', celebrate({
    [Segments.BODY]: UserLogin.joiSchema()
}), async function(req, res, next) {
    try {
        const { username, password } = req.body;
        const token = await UserService.loginUser(new UserLogin(username, password));
        return res.status(200).json({ token });
    } catch(error) {
        next(error)
    }
});

export default router