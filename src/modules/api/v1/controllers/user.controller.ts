import {ControllerBase} from "../../base/controller.base";
import Controller from "../../../../interfaces/controller.interface";
import authMiddleware from "../../../../middleware/auth.middleware";
import Role from "../../../../models/role.model";
import {NextFunction, Request, Response} from "express";
import userModel from "../../../../models/user.model";
import userTransformer from "../transformers/user.tranformer";
import validationMiddleware from "../../../../middleware/validation.middleware";
import ChangePasswordDto from "../dto/authentication/change-password/changePassword.dto";
import * as bcrypt from "bcrypt";
import CurrentPasswordIncorrectException from "../../../../exceptions/CurrentPasswordIncorrectException";
import ChangeInformationDto from "../dto/changeInformation.dto";

export default class UserController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/users/current`, authMiddleware(Role.User), this.getCurrent)
            .put(`${this.path}/users/change-information`,
                authMiddleware(Role.User), validationMiddleware(ChangeInformationDto), this.changeInformation)
            .post(`${this.path}/users/change-password`,
                authMiddleware(Role.User), validationMiddleware(ChangePasswordDto), this.changePassword)
    };

    private changeInformation = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const data = request.body;
            const user = await userModel.findById(this.getProfile()._id);
            if (data.firstName) {
                user.firstName = data.firstName;
            }
            if (data.lastName) {
                user.lastName = data.lastName;
            }
            if (data.picture) {
                user.picture = data.picture;
            }
            user.updatedAt = new Date();
            await user.save();
            response.send({
                data: {...userTransformer(user)},
                message: "Thay đổi thông tin thành công",
                status: 200,
                success: true,
            });
        } catch (e) {
            next(e);
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
