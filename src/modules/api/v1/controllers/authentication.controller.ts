import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../validations/authentication/login.dto';
import RegisterDto from '../validations/authentication/register.dto';
import TokenService from "../../../../services/token.service";
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import CookieService from "../../../../services/cookie.service";
import WrongCredentialsException from "../../../../exceptions/WrongCredentialsException";
import authMiddleware from "../../../../middleware/auth.middleware";
import validationMiddleware from "../../../../middleware/validation.middleware";
import Controller from "../../../../interfaces/controller.interface";
import authModel from "../../../../models/auth.model";
import {User} from "../../../../models/role.model";
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../../../../interfaces/dataStoredInToken';
import ChangePasswordDtoDto from '../validations/authentication/changePassword.dto';

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
            .post(`${this.path}/authentication/logout`, authMiddleware(User), this.loggingOut)
            .post(`${this.path}/authentication/change-password`, authMiddleware(User),
                  validationMiddleware(ChangePasswordDtoDto), this.changePassword)
            .post(`${this.path}/authentication/refresh-token`, authMiddleware(User), this.refreshToken)
            .get(`${this.path}/current`, authMiddleware(User), this.getCurrent);
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

    private loggingOut = (request: Request, response: Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    };

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.body.new_password !== request.body.confirm_password) {
                return response.send({message: `Your new password cannot be the same as your current password`});
            }
            if (request.body.current_password === request.body.new_password) {
                return response.send({message: `current_password === new_password`});
            }

            const id = this.getProfile()._id;
            const user = await authModel.findById(id);
            const match = await bcrypt.compare(request.body.current_password, user.password);

            if (match) {
                user.password = await bcrypt.hash(request.body.new_password, 10);
                user.updated_at = new Date();
                await user.save();
                this.loggingOut(request, response);
            } else {
                response.send({message: "Old password is incorrect"});
            }

        } catch (e) {
            // next(e);
        }
    };

    private refreshToken = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const cookies = request.cookies;
            const authorization: any = request.headers['x-access-token'] || request.headers.authorization;

            if ((cookies && cookies.Authorization) || authorization) {
                const secret: string = process.env.JWT_SECRET;
                const token: string = authorization ? authorization.slice(7, authorization.length) : cookies.Authorization;
                const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
                const id = verificationResponse._id;
                const user = await authModel.findById(id);

                if (user) {
                    const tokenData = this.tokenService.createToken(user, true);
                    const refreshTokenData = this.tokenService.createToken(user, false);
                    const valueToken = {
                        access_token: tokenData.token,
                        refresh_token: refreshTokenData.token,
                    };

                    response.setHeader('Set-Cookie', [this.cookieService.createCookie(tokenData)]);
                    response.send(valueToken);
                } else {
                    next(new WrongCredentialsException());
                }
            }
        } catch (e) {
            next(e);
        }
    };

}

