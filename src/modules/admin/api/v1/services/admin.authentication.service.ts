﻿import authModel from "../../../../../models/auth.model";
import UserWithThatEmailAlreadyExistsException from "../../../../../exceptions/UserWithThatEmailAlreadyExistsException";
import * as bcrypt from 'bcrypt';
import RegisterDto from "../validations/authentication/register.dto";
import TokenService from "../../../../../services/token.service";
import CookieService from "../../../../../services/cookie.service";

class AdminAuthenticationService {
    public user = authModel;
    public tokenService = new TokenService();
    public cookieService = new CookieService();

    public async register(userData: RegisterDto) {
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
                role: "pending"
            });
        const tokenData = this.tokenService.createToken(user, true);
        const cookie = this.cookieService.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }

}

export default AdminAuthenticationService;
