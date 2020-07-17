import {ControllerBase} from "../../base/controller.base";
import {NextFunction, Request, Response} from 'express';
import * as bcrypt from 'bcrypt';
import TokenService from "../../../../../services/token.service";
import userModel from "../../../../../models/user.model";
import validationMiddleware from "../../../../../middleware/validation.middleware";
import authMiddleware from "../../../../../middleware/auth.middleware";
import WrongCredentialsException from "../../../../../exceptions/WrongCredentialsException";
import Controller from '../../../../../interfaces/controller.interface';
import Role from "../../../../../models/role.model";
import LoginDto from "../dto/authentication/login.dto";
import userTransformer from "../transformers/user.tranformer";
import RegisterDto from "../dto/authentication/register.dto";

export default class AdminAuthenticationController extends ControllerBase implements Controller {
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
            .get(`${this.path}/current`, authMiddleware(Role.Admin), this.getCurrent)
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: RegisterDto = request.body;
        try {
            const user = await this.adminAuthenticationService.register(userData);
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
        const user = await this.user.findOne({email: logInData.email});
        if (user && user.role === 'admin') {
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
                data: {...userTransformer(user)},
                message: "",
                status: 200,
                success: true,
            });
        } catch (e) {
            next(e);
        }
    };

}

