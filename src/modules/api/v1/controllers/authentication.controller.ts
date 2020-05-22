import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../validations/authentication/login.dto';
import RegisterDto from '../validations/authentication/register.dto';
import TokenService from "../../../../services/token.service";
import {Request, Response, NextFunction} from 'express';
import * as bcrypt from 'bcrypt';
import CookieService from "../../../../services/cookie.service";
import WrongCredentialsException from "../../../../exceptions/WrongCredentialsException";
import authMiddleware from "../../../../middleware/auth.middleware";
import validationMiddleware from "../../../../middleware/validation.middleware";
import Controller from "../../../../interfaces/controller.interface";
import authModel from "../../../../models/auth.model";

export default class AuthenticationController extends ControllerBase implements Controller {
    public cookieService = new CookieService();
    public tokenService = new TokenService();
    private user = authModel;

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .post(`${this.path}/authentication/register`, validationMiddleware(RegisterDto), this.registration)
            .post(`${this.path}/authentication/login`, validationMiddleware(LoginDto), this.loggingIn)
            .post(`${this.path}/authentication/logout`, authMiddleware, this.loggingOut)
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: RegisterDto = request.body;
        try {
            const {
                cookie,
                user,
            } = await this.authenticationService.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };

    private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
        const logInData: LoginDto = request.body;
        const user = await this.user.findOne({email: logInData.email, role: "user"});
        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.get('password', null, {getters: false}),
            );
            if (isPasswordMatching) {
                const tokenData = this.tokenService.createToken(user, true);
                const refreshTokenData = this.tokenService.createToken(user, false);
                const valueToken = {
                    access_token: tokenData.token,
                    refresh_token: refreshTokenData.token,
                };
                response.setHeader('Set-Cookie', [this.cookieService.createCookie(tokenData)]);
                response.send({
                    data: {
                        ...user.toJSON(),
                        ...valueToken
                    },
                    message: "Success"
                });
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    };

    private loggingOut = (request: Request, response: Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    };

}

