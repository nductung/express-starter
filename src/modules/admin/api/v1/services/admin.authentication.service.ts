import userModel from "../../../../../models/user.model";
import * as bcrypt from 'bcrypt';
import RegisterDto from "../dto/authentication/register.dto";
import TokenService from "../../../../../services/token.service";
import CookieService from "../../../../../services/cookie.service";
import {ServiceBase} from '../../base/service.base';
import UserAlreadyExistsException from "../../../../../exceptions/UserAlreadyExistsException";

class AdminAuthenticationService extends ServiceBase {
    public user = userModel;
    public tokenService = new TokenService();
    public cookieService = new CookieService();

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
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
            role: 'pending'
        });
        const tokenData = this.tokenService.createToken(user, true);
        const cookie = this.cookieService.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    };

}

export default AdminAuthenticationService;
