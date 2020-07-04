import userModel from "../../../../models/user.model";
import * as bcrypt from 'bcrypt';
import {ServiceBase} from '../../base/service.base';
import UserAlreadyExistsException from "../../../../exceptions/UserAlreadyExistsException";
import RegisterDto from "../dto/authentication/register.dto";

class AuthenticationService extends ServiceBase {
    public user = userModel;

    constructor() {
        super(userModel);
    }

    public register = async (userData: RegisterDto) => {
        if (await this.user.findOne({email: userData.email})) {
            throw new UserAlreadyExistsException('Email', userData.email);
        } else if (await this.user.findOne({username: userData.username})) {
            throw new UserAlreadyExistsException('Username', userData.username);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        // @ts-ignore
        return await this.user.create({
            ...userData,
            password: hashedPassword,
        })
    };

    public usernameGenerator = async (str: string) => {
        let username = str.replace(/@.*$/, "");
        if (await userModel.findOne({username})) {
            let loop = true;
            do {
                let random: any = Math.floor(Math.random() * 999 - 100 + 1) + 100;
                random = username + random;
                if (!await userModel.findOne({username: random})) {
                    loop = false;
                    username = random;
                    return username
                }
            } while (loop)
        } else {
            return username
        }
    }

}

export default AuthenticationService;
