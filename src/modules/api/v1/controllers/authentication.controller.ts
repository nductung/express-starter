import {ControllerBase} from "../../base/controller.base";
import LoginDto from '../dto/authentication/login.dto';
import RegisterDto from '../dto/authentication/register.dto';
import TokenService from "../../../../services/token.service";
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from "../../../../exceptions/WrongCredentialsException";
import validationMiddleware from "../../../../middleware/validation.middleware";
import userModel from "../../../../models/user.model";
import Controller from '../../../../interfaces/controller.interface';
import userTransformer from "../transformers/user.tranformer";
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
            .post(`${this.path}/authentication/register`, validationMiddleware(RegisterDto), this.registration)
            .post(`${this.path}/authentication/login`, validationMiddleware(LoginDto), this.loggingIn)

            .post(`${this.path}/authentication/request-verify-account`,
                validationMiddleware(RequestVerifyAccountDto), this.requestVerifyAccount)
            .get(`${this.path}/authentication/verify-account`,
                queryParamsMiddleware(VerifyAccountWithParametersDto), this.verifyAccount)
            .post(`${this.path}/authentication/verify-account`, validationMiddleware(VerifyAccountDto), this.verifyAccount)

            .post(`${this.path}/authentication/request-forgot-password`,
                validationMiddleware(RequestChangePasswordDto), this.requestForgotPassword)
            .post(`${this.path}/authentication/forgot-password`, validationMiddleware(ForgotPasswordDto), this.forgotPassword)
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
        const user = await this.user.findOne({email: logInData.email});
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
                            ...userTransformer(user),
                            ...valueToken
                        },
                        message: "Đăng nhập thành công",
                        status: 200,
                        success: true,
                    });
                } else {
                    response.status(400).send({
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
                                ...userTransformer(user),
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
                    user.password = await bcrypt.hash(request.body.password, 10);
                    user.confirmed = true;
                    user.updatedAt = new Date();
                    await user.save();
                    this.globals.__redis.del(key);

                    response.send({
                        data: null,
                        message: "Thay đổi mật khẩu thành công",
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

}

