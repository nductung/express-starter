import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import UserDto from '../validations/user/create.dto';
import IDDto from "../validations/checkID.dto";
import authMiddleware from '../../../../../middleware/auth.middleware';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';
import Controller from '../../../../../interfaces/controller.interface';

class AdminUserController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/users`, authMiddleware(Admin), this.getUser)
            .post(`${this.path}/users/create`, authMiddleware(Admin), validationMiddleware(UserDto), this.createUser)
            .get(`${this.path}/users/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private getUser = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminUserService.getUser(request, response, next);
    };

    private createUser = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminUserService.createUser(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminUserService.getDetailById(request, response, next);
    };

}

export default AdminUserController;
