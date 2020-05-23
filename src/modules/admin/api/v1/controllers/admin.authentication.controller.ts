import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../validations/authentication/login.dto';
import RegisterDto from '../validations/authentication/register.dto';
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import {Admin} from "../../../../../models/role.model";
import Controller from "../../../../../interfaces/controller.interface";
import CookieService from "../../../../../services/cookie.service";
import TokenService from "../../../../../services/token.service";
import authModel from "../../../../../models/auth.model";
import validationMiddleware from "../../../../../middleware/validation.middleware";
import authMiddleware from "../../../../../middleware/auth.middleware";
import WrongCredentialsException from "../../../../../exceptions/WrongCredentialsException";

export default class AdminAuthenticationController extends ControllerBase implements Controller {
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
            .post(`${this.path}/authentication/logout`, authMiddleware(Admin), this.loggingOut)
            .get(`${this.path}/current`, authMiddleware(Admin), this.getCurrent);
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: RegisterDto = request.body;
        try {
            const {
                cookie,
                user,
            } = await this.adminAuthenticationService.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };

    private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
        const logInData: LoginDto = request.body;
        const user = await this.user.findOne({email: logInData.email});
        if (user && user.role === 'admin') {
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
        } else if (user && user.role === 'pending') {
            response.status(401).send({message: "Unconfirmed account"});
        } else {
            next(new WrongCredentialsException());
        }
    };

    private loggingOut = (request: Request, response: Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    };

    private getCurrent = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = this.getProfile()._id;
            const user = await authModel.findById(id);

            response.send({
                              data: {
                                  ...user.toJSON(),
                              },
                              message: "Success"
                          });
        } catch (e) {
            next(e);
        }
    };

}

