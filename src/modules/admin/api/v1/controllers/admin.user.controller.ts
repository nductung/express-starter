import {ControllerBase} from "../../base/controller.base";
import Controller from "../../../../../interfaces/controller.interface";
import authMiddleware from "../../../../../middleware/auth.middleware";
import Role from "../../../../../models/role.model";
import {NextFunction, Request, Response} from "express";

export default class AdminUserController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/users`, authMiddleware(Role.Admin), this.getUsers)
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
    }

}
