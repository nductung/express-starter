import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../dto/authentication/login.dto';
import RegisterDto from '../dto/authentication/register.dto';
import TokenService from "../../../../services/token.service";
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from "../../../../exceptions/WrongCredentialsException";
import authMiddleware from "../../../../middleware/auth.middleware";
import validationMiddleware from "../../../../middleware/validation.middleware";
import userModel from "../../../../models/user.model";
import Role from "../../../../models/role.model";
import Controller from '../../../../interfaces/controller.interface';
import ChangePasswordDto from "../dto/authentication/changePassword.dto";
import userTransformer from "../transformers/user.tranformer";
import * as passport from "passport";
import CurrentPasswordIncorrectException from "../../../../exceptions/CurrentPasswordIncorrectException";

export default class AuthenticationController extends ControllerBase implements Controller {
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
            .get(`${this.path}/current`, authMiddleware(Role.User), this.getCurrent)
            .post(`${this.path}/authentication/change-password`, authMiddleware(Role.User),
                validationMiddleware(ChangePasswordDto), this.changePassword)
            .get(`${this.path}/authentication/google`, passport.authenticate('google', {scope: ['profile', 'email']}))
            .get(`${this.path}/authentication/google/callback`,
                passport.authenticate('google', {failureRedirect: `/`}), this.loginWithGoogle)
            .get(`${this.path}/authentication/facebook`, passport.authenticate('facebook', {scope: 'email'}))
            .get(`${this.path}/authentication/facebook/callback`,
                passport.authenticate('facebook', {failureRedirect: '/'}), this.loginWithFacebook)
    };

    private loginWithFacebook = async (request: any, response: Response, next: NextFunction) => {
        try {
            const data = request.user._json;
            const user = await userModel.findOne({ref_facebook: data.id});
            if (user) {
                response.send({
                    data: {
                        ...userTransformer(user.toJSON()),
                        ...this.tokenService.createValueToken(user)
                    },
                    message: "Đăng nhập thành công",
                    status: 200,
                    success: true,
                })
            } else {
                const userData = new userModel();
                userData.firstName = data.first_name;
                userData.lastName = data.last_name;
                userData.username = await this.authenticationService.usernameGenerator(data.email);
                userData.picture = data.picture.data.url;
                userData.password = await bcrypt.hash('12356890', 10);
                userData.email = await userModel.findOne({email: data.email})
                    ? `no-email-${Math.floor(Math.random() * 999999 - 100000 + 1) + 100000}@email.com`
                    : data.email;
                userData.ref_facebook = data.id;

                await userData.save();

                response.send({
                    data: {
                        ...userTransformer(userData.toJSON()),
                        ...this.tokenService.createValueToken(userData)
                    },
                    message: "Đăng nhập thành công",
                    status: 200,
                    success: true,
                });
            }
        } catch (e) {
            next(e)
        }
    };

    private loginWithGoogle = async (request: any, response: Response, next: NextFunction) => {
        try {
            const data = request.user._json;
            const user = await userModel.findOne({email: data.email});
            if (user) {
                response.send({
                    data: {
                        ...userTransformer(user.toJSON()),
                        ...this.tokenService.createValueToken(user)
                    },
                    message: "Đăng nhập thành công",
                    status: 200,
                    success: true,
                })
            } else {
                const userData = new userModel();
                userData.firstName = data.given_name;
                userData.lastName = data.family_name;
                userData.username = await this.authenticationService.usernameGenerator(data.email);
                userData.picture = data.picture;
                userData.password = await bcrypt.hash('12356890', 10);
                userData.email = data.email;

                await userData.save();

                response.send({
                    data: {
                        ...userTransformer(userData.toJSON()),
                        ...this.tokenService.createValueToken(userData)
                    },
                    message: "Đăng nhập thành công",
                    status: 200,
                    success: true,
                });
            }
        } catch (e) {
            next(e)
        }
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: RegisterDto = request.body;
        try {
            const user = await this.authenticationService.register(userData);
            response.send({
                data: userTransformer(user),
                message: "Bạn đã đăng ký thành công",
                status: 200,
                success: true,
            });
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

                response.send({
                    data: {
                        ...userTransformer(user.toJSON()),
                        ...valueToken
                    },
                    message: "Đăng nhập thành công",
                    status: 200,
                    success: true,
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
            const user = await userModel.findById(this.getProfile()._id);
            response.send({
                data: {...userTransformer(user.toJSON()),},
                message: "",
                status: 200,
                success: true,
            });
        } catch (e) {
            next(e);
        }
    };

    private changePassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findById(this.getProfile()._id);
            const match = await bcrypt.compare(request.body.currentPassword, user.password);

            if (match) {
                user.password = await bcrypt.hash(request.body.newPassword, 10);
                user.updatedAt = new Date();
                await user.save();
                response.send({
                    data: {},
                    message: "Thay đỏi mật khẩu thành công",
                    status: 200,
                    success: true,
                });
            } else {
                next(new CurrentPasswordIncorrectException());
            }

        } catch (e) {
            next(e);
        }
    };

}

