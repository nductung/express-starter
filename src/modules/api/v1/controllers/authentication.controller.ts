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
import ChangePasswordDto from "../dto/authentication/changePassword.dto";
import DataStoredInToken from "../../../../interfaces/dataStoredInToken";
import * as jwt from "jsonwebtoken";

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
            .get(`${this.path}/current`, authMiddleware(Role.User), this.getCurrent)
            .post(`${this.path}/authentication/change-password`, authMiddleware(Role.User),
                validationMiddleware(ChangePasswordDto), this.changePassword)
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

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.body.currentPassword === request.body.newPassword) {
                return response.send({message: `Mật khẩu mới phải khác mật khẩu hiện tại`});
            } else if (request.body.newPassword !== request.body.confirmPassword) {
                return response.send({message: `Mật khẩu mới và mật khẩu xác nhận không giống nhau`});
            }

            const id = this.getProfile()._id;
            const user = await userModel.findById(id);
            const match = await bcrypt.compare(request.body.currentPassword, user.password);

            if (match) {
                user.password = await bcrypt.hash(request.body.newPassword, 10);
                user.updatedAt = new Date();
                user.session = 0;
                await user.save();
                this.loggingOut(request, response, next);
                response.send({
                    message: "Thay đổi mật khẩu thành công"
                });
            } else {
                response.send({message: "Mật khẩu hiện tại không đúng"});
            }

        } catch (e) {
            next(e);
        }
    };

}

