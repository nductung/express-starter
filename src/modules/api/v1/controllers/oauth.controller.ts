import {ControllerBase} from "../../base/controller.base";
import TokenService from "../../../../services/token.service";
import {NextFunction, Response} from 'express';
import * as bcrypt from 'bcrypt';
import userModel from "../../../../models/user.model";
import Controller from '../../../../interfaces/controller.interface';
import userTransformer from "../transformers/user.tranformer";
import * as passport from "passport";

export default class OauthController extends ControllerBase implements Controller {
    public tokenService = new TokenService();
    private user = userModel;

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/oauth/google`, passport.authenticate('google', {scope: ['profile', 'email']}))
            .get(`${this.path}/oauth/facebook`, passport.authenticate('facebook', {scope: 'email'}))
            .get(`${this.path}/oauth/instagram`, passport.authenticate('instagram'))

            .get(`${this.path}/oauth/google/callback`,
                passport.authenticate('google', {failureRedirect: `/`}), this.loginWithGoogle)
            .get(`${this.path}/oauth/facebook/callback`,
                passport.authenticate('facebook', {failureRedirect: '/'}), this.loginWithFacebook)
            .get(`${this.path}/oauth/instagram/callback`,
                passport.authenticate('instagram', {failureRedirect: `/`}), this.loginWithInstagram)
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
                        ...userTransformer(user),
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
                        ...userTransformer(userData),
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
                        ...userTransformer(user),
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
                        ...userTransformer(userData),
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

    private loginWithInstagram = async (request: any, response: Response, next: NextFunction) => {
        try {
            //
        } catch (e) {
            next(e)
        }
    };

}

