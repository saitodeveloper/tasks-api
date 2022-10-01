import express from 'express';
import { celebrate, Segments } from 'celebrate';
import { UserLogin, UserRegister } from './models';
import { UserService } from './service';

const router = express.Router();

router.post('/', celebrate({
    [Segments.BODY]: UserRegister.joiSchema()
}), async function(req, res, next) {
    try {
        const result = await UserService.createUserLogin(new UserRegister(req.body))
        return res.status(201).json({ id: result.insertedId.toString() });
    } catch(error) {
        next(error)
    }
});

router.post('/login', celebrate({
    [Segments.BODY]: UserLogin.joiSchema()
}), async function(req, res, next) {
    try {
        const token = await UserService.loginUser(new UserLogin(req.body))
        return res.status(200).json({ token });
    } catch(error) {
        next(error)
    }
});

export default router