import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import IDDto from '../validations/checkID.dto';
import ProxyDto from '../validations/proxy/create.dto';
import authMiddleware from '../../../../../middleware/auth.middleware';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';
import Controller from '../../../../../interfaces/controller.interface';

class AdminProxyController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/proxies`, authMiddleware(Admin), this.getProxy)
            .post(`${this.path}/proxies/create`, authMiddleware(Admin), validationMiddleware(ProxyDto), this.createProxy)
            .get(`${this.path}/proxies/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private createProxy = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminProxyService.createProxy(request, response, next);
    };

    private getProxy = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminProxyService.getProxy(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminProxyService.getDetailById(request, response, next);
    };

}

export default AdminProxyController;
