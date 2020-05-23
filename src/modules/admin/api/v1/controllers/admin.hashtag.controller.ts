import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import IDDto from "../validations/checkID.dto";
import HashtagDto from '../validations/hashtag/create.dto';
import authMiddleware from '../../../../../middleware/auth.middleware';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';
import Controller from '../../../../../interfaces/controller.interface';

class AdminHashtagController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/hashtags`, authMiddleware(Admin), this.getHashtag)
            .post(`${this.path}/hashtags/create`, authMiddleware(Admin), validationMiddleware(HashtagDto), this.createHashtag)
            .get(`${this.path}/hashtags/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private getHashtag = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminHashtagService.getHashtag(request, response, next);
    };

    private createHashtag = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminHashtagService.createHashtag(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminHashtagService.getDetailById(request, response, next);
    };

}

export default AdminHashtagController;
