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
            .get(`${this.path}/authentication/google/callback`, passport.authenticate('google', {failureRedirect: `/failed`}),
                async (request: any, response: Response) => {
                    console.log(request.user);
                    const dataUser = request.user._json;
                    if (await userModel.findOne({email: dataUser.email})) {
                        console.log('da ton tai')
                    } else {
                        console.log('chua ton tai');
                        const user = new userModel();
                        user.firstName = dataUser.family_name;
                        user.lastName = dataUser.given_name;
                        user.username = dataUser.email.replace(/@.*$/, "");
                        user.email = dataUser.email;
                        user.picture = dataUser.picture;
                        console.log(dataUser.email.match(/^([^@]*)@/));
                        console.log(user);
                    }
                    response.end();
                }
            )
    };

    private registration = async (request: Request, response: Response, next: NextFunction) => {
        const userData: RegisterDto = request.body;
        try {
            const user = await this.authenticationService.register(userData);
            response.send({
                data: userTransformer(user),
                message: "Bạn đã đăng ký thành công"
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
            const user = await userModel.findById(this.getProfile()._id);
            response.send({data: {...userTransformer(user.toJSON()),}, message: "Success"});
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

            const user = await userModel.findById(this.getProfile()._id);
            const match = await bcrypt.compare(request.body.currentPassword, user.password);

            if (match) {
                user.password = await bcrypt.hash(request.body.newPassword, 10);
                user.updatedAt = new Date();
                await user.save();
                response.send({message: "Thay đỏi mật khẩu thành công"});
            } else {
                response.send({message: "Mật khẩu hiện tại không đúng"});
            }

        } catch (e) {
            next(e);
        }
    };

}

