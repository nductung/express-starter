import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../dto/authentication/login.dto';
import RegisterDto from '../dto/authentication/register.dto';
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import CookieService from "../../../../../services/cookie.service";
import TokenService from "../../../../../services/token.service";
import userModel from "../../../../../models/user.model";
import validationMiddleware from "../../../../../middleware/validation.middleware";
import authMiddleware from "../../../../../middleware/auth.middleware";
import WrongCredentialsException from "../../../../../exceptions/WrongCredentialsException";
import Controller from '../../../../../interfaces/controller.interface';
import Role from "../../../../../models/role.model";
import userTransformer from "../transformers/user.tranformer";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../../../../../interfaces/dataStoredInToken";

export default class AdminAuthenticationController extends ControllerBase implements Controller {
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
            .post(`${this.path}/authentication/logout`, authMiddleware(Role.Admin), this.loggingOut)
            .get(`${this.path}/current`, authMiddleware(Role.Admin), this.getCurrent);
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
                    accessToken: tokenData.token,
                    // refreshToken: refreshTokenData.token,
                };

                //
                const secret: string = process.env.JWT_SECRET;
                const verificationResponse: any = jwt.verify(valueToken.accessToken, secret) as DataStoredInToken;
                await this.user.findByIdAndUpdate(user._id, {
                    session: verificationResponse.exp
                });

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

    private loggingOut = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await userModel.findByIdAndUpdate(this.getProfile()._id, {
                session: 0
            });
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            // response.send(200);
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

