import { UserLogin, UserRegister } from "./models";
import { UserRepository } from "./repository";
import { Auth } from '../../auth';
import { UnauthorizedError } from '../../errors';

export namespace UserService {

    export async function createUserLogin(user: UserRegister) {
        user.password = await Auth.hashSaltString(user.password);
        return UserRepository.createUserLogin(user);
    }

    export async function loginUser(user: UserLogin) {
        const userResult = await UserRepository.findByUsername(user);

        if (!userResult) {
            throw new UnauthorizedError('User not authorized');
        }

        const isPasswordCorrect = await Auth.hashSaltValidate(
            user.password, 
            userResult.password
        );

        if (!isPasswordCorrect) {
            throw new UnauthorizedError('User not authorized');
        }

        const { username } = userResult
        return await Auth.generateToken({ username });
    }
}