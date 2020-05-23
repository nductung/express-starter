import authModel from "../../../../../models/auth.model";
import UserWithThatEmailAlreadyExistsException from "../../../../../exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from 'bcrypt';
import RegisterDto from "../validations/authentication/register.dto";
import TokenService from "../../../../../services/token.service";
import CookieService from "../../../../../services/cookie.service";
import {ServiceBase} from '../../base/service.base';

class AdminAuthenticationService extends ServiceBase {
    public user = authModel;
    public tokenService = new TokenService();
    public cookieService = new CookieService();

    constructor() {
        super(authModel);
    }

    public register = async (userData: RegisterDto) => {
        if (
            await this.user.findOne({email: userData.email})
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create(
            {
                ...userData,
                password: hashedPassword,
                role: "pending",
                avatar: {
                    url: "https://www.akveo.com/ngx-admin/favicon.png"
                }
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
