import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import IDDto from "../validations/checkID.dto";
import authMiddleware from '../../../../../middleware/auth.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';
import Controller from '../../../../../interfaces/controller.interface';

class AdminJobController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/jobs`, authMiddleware(Admin), this.getJob)
            .get(`${this.path}/jobs/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById)
            .post(`${this.path}/jobs/run`, authMiddleware(Admin), this.runJob);
    };

    private getJob = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminJobService.getJob(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminJobService.getDetailById(request, response, next);
    };

    private runJob = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminJobService.runJob(request, response, next);
    };

}

export default AdminJobController;
