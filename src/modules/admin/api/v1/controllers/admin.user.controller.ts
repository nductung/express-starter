import {ControllerBase} from "../../base/controller.base";
import Controller from "../../../../../interfaces/controller.interface";
import authMiddleware from "../../../../../middleware/auth.middleware";
import Role from "../../../../../models/role.model";
import {NextFunction, Request, Response} from "express";
import userModel from "../../../../../models/user.model";
import userTransformer from "../transformers/user.tranformer";
import UserNotFoundException from "../../../../../exceptions/UserNotFoundException";

export default class AdminUserController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/users`, authMiddleware(Role.Admin), this.getUsers)
            .get(`${this.path}/user/:username`, authMiddleware(Role.Admin), this.getUser)
            .delete(`${this.path}/user/:username`, authMiddleware(Role.Admin), this.deleteUser)
    };

    private getUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.adminUserService.getListUser(request.query);
            response.send({
                data: users,
                message: "",
                status: 200,
                success: true,
            });
        } catch (e) {
            next(e)
        }
    };

    private getUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({username: request.params.username});
            if (user) {
                response.send({
                    data: {
                        ...userTransformer(user),
                    },
                    message: "",
                    status: 200,
                    success: true,
                });
            } else {
                next(new UserNotFoundException());
            }
        } catch (e) {
            next(e)
        }
    }

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findOne({username: request.params.username});
            if (user) {
                await userModel.findByIdAndRemove(user._id);
                response.send({
                    data: null,
                    message: `Bạn đã xóa tài khoản ${user.username} khỏi hệ thống`,
                    status: 200,
                    success: true,
                });
            } else {
                next(new UserNotFoundException());
            }
        } catch (e) {
            next(e)
        }
    }

}
