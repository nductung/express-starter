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
import VerifiedAccountException from "../../../../exceptions/VerifiedAccountException";
import VerifiedAccountDto from "../dto/authentication/verified-account/verifiedAccount.dto";
import UserNotFoundException from "../../../../exceptions/UserNotFoundException";

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
            // register
            .post(`${this.path}/authentication/register`, validationMiddleware(RegisterDto), this.registration)
            // login
            .post(`${this.path}/authentication/login`, validationMiddleware(LoginDto), this.loggingIn)

            // verified account
            .post(`${this.path}/authentication/request-verified-account`,
                validationMiddleware(VerifiedAccountDto), this.requestVerifiedAccount)
            .get(`${this.path}/authentication/verified-account`, this.verifiedAccount)

            // oauth 2.0
            .get(`${this.path}/authentication/google`, passport.authenticate('google', {scope: ['profile', 'email']}))
            .get(`${this.path}/authentication/google/callback`,
                passport.authenticate('google', {failureRedirect: `/`}), this.loginWithGoogle)
            .get(`${this.path}/authentication/facebook`, passport.authenticate('facebook', {scope: 'email'}))
            .get(`${this.path}/authentication/facebook/callback`,
                passport.authenticate('facebook', {failureRedirect: '/'}), this.loginWithFacebook)

            // get profile
            .get(`${this.path}/current`, authMiddleware(Role.User), this.getCurrent)

            // change password
            .post(`${this.path}/authentication/change-password`, authMiddleware(Role.User),
                validationMiddleware(ChangePasswordDto), this.changePassword)
    };


    private registration = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userData: RegisterDto = request.body;
            const user = await this.authenticationService.register(userData);
            if (user) {
                const sendEmail = await this.sendMailService.sendMailVerifiedAccount(user);
                if (sendEmail) {
                    response.send({
                        data: {},
                        message: "Hãy kiểm tra email của bạn để kích hoạt tài khoản",
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
                        message: "Vui lòng kích hoạt tài khoản của bạn trước khi đăng nhập",
                        status: 400,
                        success: false,
                    });
                    // next(new AccountNotActiveException());
                }
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    };

    private requestVerifiedAccount = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({email: request.body.email});
            if (user) {
                const sendEmail = await this.sendMailService.sendMailVerifiedAccount(user);
                if (sendEmail) {
                    response.send({
                        data: {},
                        message: "Hãy kiểm tra email của bạn để kích hoạt tài khoản",
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

    private verifiedAccount = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = request.body.otp;
            const username = await this.globals.__redis.getAsync(token);
            if (username) {
                const user = await userModel.findOne({username});
                if (user) {
                    if (user.confirmed) {
                        next(new VerifiedAccountException());
                    } else {
                        user.confirmed = true;
                        user.updatedAt = new Date();
                        await user.save();

                        //
                        this.globals.__redis.del(token);

                        response.send({
                            data: {
                                ...userTransformer(user.toJSON()),
                            },
                            message: "Tài khoản của bạn đã được xác thực thành công, xin mời đăng nhập",
                            status: 200,
                            success: true,
                        });
                    }
                } else {
                    next(new UserNotFoundException());
                }
            } else {
                next(new AuthenticationTokenException());
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

