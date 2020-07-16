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
import ChangePasswordDto from "../dto/authentication/change-password/changePassword.dto";
import userTransformer from "../transformers/user.tranformer";
import * as passport from "passport";
import CurrentPasswordIncorrectException from "../../../../exceptions/CurrentPasswordIncorrectException";
import SendMailService from "../../../../services/sendMail.service";
import CannotSendEmailException from "../../../../exceptions/CannotSendEmail.exception";
import AuthenticationTokenException from "../../../../exceptions/AuthenticationTokenException";
import VerifyAccountException from "../../../../exceptions/VerifyAccountException";
import RequestVerifyAccountDto from "../dto/authentication/verify-account/requestVerifyAccount.dto";
import UserNotFoundException from "../../../../exceptions/UserNotFoundException";
import VerifyAccountDto from "../dto/authentication/verify-account/verifyAccount.dto";
import VerifyAccountWithParametersDto from "../dto/authentication/verify-account/verifyAccountWithParameters.dto";
import RequestChangePasswordDto from "../dto/authentication/forgot-password/requestChangePassword.dto";
import ForgotPasswordDto from "../dto/authentication/forgot-password/forgotPassword.dto";
import queryParamsMiddleware from "../../../../middleware/queryParams.middleware";

export default class AuthenticationController extends ControllerBase implements Controller {
    public tokenService = new TokenService();
    public sendMailService = new SendMailService();
    private user = userModel;

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`/`, (request: Request, response: Response) => response.send('Hello World!'))

            .post(`${this.path}/authentication/register`, validationMiddleware(RegisterDto), this.registration)
            .post(`${this.path}/authentication/login`, validationMiddleware(LoginDto), this.loggingIn)
            .get(`${this.path}/current`, authMiddleware(Role.User), this.getCurrent)

            // oauth 2.0
            .get(`${this.path}/authentication/google`, passport.authenticate('google', {scope: ['profile', 'email']}))
            // tslint:disable-next-line:max-line-length
            .get(`${this.path}/authentication/google/callback`, passport.authenticate('google', {failureRedirect: `/`}), this.loginWithGoogle)
            .get(`${this.path}/authentication/facebook`, passport.authenticate('facebook', {scope: 'email'}))
            // tslint:disable-next-line:max-line-length
            .get(`${this.path}/authentication/facebook/callback`, passport.authenticate('facebook', {failureRedirect: '/'}), this.loginWithFacebook)

            // verify account
            // tslint:disable-next-line:max-line-length
            .post(`${this.path}/authentication/request-verify-account`, validationMiddleware(RequestVerifyAccountDto), this.requestVerifyAccount)
            .post(`${this.path}/authentication/verify-account`, validationMiddleware(VerifyAccountDto), this.verifyAccount)
            // tslint:disable-next-line:max-line-length
            .get(`${this.path}/authentication/verify-account`, queryParamsMiddleware(VerifyAccountWithParametersDto), this.verifyAccount)

            // password
            // tslint:disable-next-line:max-line-length
            .post(`${this.path}/authentication/request-forgot-password`, validationMiddleware(RequestChangePasswordDto), this.requestForgotPassword)
            .post(`${this.path}/authentication/forgot-password`, validationMiddleware(ForgotPasswordDto), this.forgotPassword)
            // tslint:disable-next-line:max-line-length
            .post(`${this.path}/authentication/change-password`, authMiddleware(Role.User), validationMiddleware(ChangePasswordDto), this.changePassword)
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: RegisterDto = request.body;
            const user = await this.authenticationService.register(userData);
            if (user) {
                const sendEmail = await this.sendMailService.sendMailVerifyAccount(user);
                if (sendEmail) {
                    response.send({
                        data: null,
                        message: "Chúng tôi đã gửi một mã vào địa chỉ email của bạn. Hãy nhập mã đó để xác minh tài khoản",
                        status: 200,
                        success: true,
                    });
                } else {
                    next(new CannotSendEmailException())
                }
            }
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
                if (user.confirmed) {
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
                    response.send({
                        data: {
                            username: user.username,
                            email: user.email
                        },
                        message: "Vui lòng xác minh tài khoản của bạn trước khi đăng nhập",
                        status: 400,
                        success: false,
                    });
                }
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
                data: {...userTransformer(user.toJSON())},
                message: "",
                status: 200,
                success: true,
            });
        } catch (e) {
            next(e);
        }
    };

    private loginWithGoogle = async (request: any, response: Response, next: NextFunction) => {
        try {
            const data = request.user._json;
            const user = await userModel.findOne({email: data.email});
            if (user) {
                if (!user.picture || user.picture !== data.picture) {
                    user.picture = data.picture;
                    await user.save();
                }

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

    private loginWithFacebook = async (request: any, response: Response, next: NextFunction) => {
        try {
            const data = request.user._json;
            const user = await userModel.findOne({email: data.email});
            if (user) {
                if (!user.picture || user.picture !== data.picture) {
                    user.picture = data.picture.data.url;
                    await user.save();
                }

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

    private requestVerifyAccount = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({email: request.body.email});
            if (user) {
                const sendEmail = await this.sendMailService.sendMailVerifyAccount(user);
                if (sendEmail) {
                    response.send({
                        data: null,
                        message: "Chúng tôi đã gửi một mã vào địa chỉ email của bạn. Hãy nhập mã đó để xác minh tài khoản",
                        status: 200,
                        success: true,
                    });
                } else {
                    next(new CannotSendEmailException())
                }
            }
        } catch (e) {
            next(e)
        }
    };

    private verifyAccount = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let dataRequest;
            if (request.method === 'POST') {
                dataRequest = request.body;
            } else if (request.method === 'GET') {
                dataRequest = request.query;
            }
            const user = await userModel.findOne({email: dataRequest.email});
            if (user) {
                if (!user.confirmed) {
                    const key = `verify-account-${user.username}`;
                    const otp = await this.globals.__redis.getAsync(key);
                    if (otp === dataRequest.otp) {
                        user.confirmed = true;
                        user.updatedAt = new Date();
                        await user.save();
                        this.globals.__redis.del(key);

                        response.send({
                            data: {
                                ...userTransformer(user.toJSON()),
                            },
                            message: "Tài khoản của bạn đã được xác minh thành công, xin mời đăng nhập",
                            status: 200,
                            success: true,
                        });
                    } else {
                        next(new AuthenticationTokenException());
                    }
                } else {
                    next(new VerifyAccountException());
                }
            } else {
                next(new UserNotFoundException());
            }
        } catch (e) {
            next(e)
        }
    };

    private requestForgotPassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({email: request.body.email});
            if (user) {
                const sendEmail = await this.sendMailService.sendMailForgotPassword(user);
                if (sendEmail) {
                    response.send({
                        data: null,
                        message: "Chúng tôi đã gửi một mã vào địa chỉ email của bạn. Hãy nhập mã đó để đặt lại mật khẩu",
                        status: 200,
                        success: true,
                    });
                } else {
                    next(new CannotSendEmailException())
                }
            }
        } catch (e) {
            next(e)
        }
    };

    private forgotPassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({email: request.body.email});
            if (user) {
                const key = `forgot-password-${user.username}`;
                const otp = await this.globals.__redis.getAsync(key);
                if (otp === request.body.otp) {
                    user.password = await bcrypt.hash(request.body.newPassword, 10);
                    user.confirmed = true;
                    user.updatedAt = new Date();
                    await user.save();
                    this.globals.__redis.del(key);

                    response.send({
                        data: null,
                        message: "Thay đỏi mật khẩu thành công",
                        status: 200,
                        success: true,
                    });
                } else {
                    next(new AuthenticationTokenException());
                }
            } else {
                next(new UserNotFoundException());
            }
        } catch (e) {
            next(e)
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
                    data: null,
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

