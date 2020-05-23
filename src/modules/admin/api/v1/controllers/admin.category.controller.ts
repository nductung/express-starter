import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import IDDto from "../validations/checkID.dto";
import CategoryDto from '../validations/category/create.dto';
import authMiddleware from '../../../../../middleware/auth.middleware';
import {NextFunction, Request, Response} from 'express';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import Controller from '../../../../../interfaces/controller.interface';

class AdminCategoryController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/categories`, authMiddleware(Admin), this.getCategory)
            .post(`${this.path}/categories/create`, authMiddleware(Admin), validationMiddleware(CategoryDto), this.createCategory)
            .get(`${this.path}/categories/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private getCategory = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCategoryService.getCategory(request, response, next);
    };

    private createCategory = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCategoryService.createCategory(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCategoryService.getDetailById(request, response, next);
    };

}

export default AdminCategoryController;
