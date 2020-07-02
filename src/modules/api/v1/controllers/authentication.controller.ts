import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../dto/authentication/login.dto';
import RegisterDto from '../dto/authentication/register.dto';
import TokenService from "../../../../services/token.service";
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import CookieService from "../../../../services/cookie.service";
import WrongCredentialsException from "../../../../exceptions/WrongCredentialsException";
import authMiddleware from "../../../../middleware/auth.middleware";
import validationMiddleware from "../../../../middleware/validation.middleware";
import userModel from "../../../../models/user.model";
import Role from "../../../../models/role.model";
import Controller from '../../../../interfaces/controller.interface';
import userTransformer from "../transformers/user.tranformer";

export default class AuthenticationController extends ControllerBase implements Controller {
    public cookieService = new CookieService();
    public tokenService = new TokenService();
    private user = userModel;

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .post(`${this.path}/authentication/register`, validationMiddleware(RegisterDto), this.registration)
            .post(`${this.path}/authentication/login`, validationMiddleware(LoginDto), this.loggingIn)
            .post(`${this.path}/authentication/logout`, authMiddleware(Role.User), this.loggingOut)
            .get(`${this.path}/current`, authMiddleware(Role.User), this.getCurrent);
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
        const user = await this.user.findOne({username: logInData.username});
        if (user && user.role === 'user') {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.get('password', null, {getters: false}),
            );
            if (isPasswordMatching) {
                const tokenData = this.tokenService.createToken(user, true);
                const refreshTokenData = this.tokenService.createToken(user, false);
                const valueToken = {
                    accessToken: tokenData.token,
                    refreshToken: refreshTokenData.token,
                };
                response.setHeader('Set-Cookie', [this.cookieService.createCookie(tokenData)]);
                response.send({
                    data: {
                        ...userTransformer(user.toJSON()),
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

    private loggingOut = (request: Request, response: Response, next: NextFunction) => {
        try {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200);
        } catch (e) {
            next(e)
        }
    };

    private getCurrent = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = this.getProfile()._id;
            const user = await userModel.findById(id);

            response.send({
                data: {
                    ...userTransformer(user.toJSON()),
                },
                message: "Success"
            });
        } catch (e) {
            next(e);
        }
    };

}

