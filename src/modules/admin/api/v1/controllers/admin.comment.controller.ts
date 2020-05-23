import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import IDDto from "../validations/checkID.dto";
import CommentDto from '../validations/comment/create.dto';
import authMiddleware from '../../../../../middleware/auth.middleware';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';
import Controller from '../../../../../interfaces/controller.interface';

class AdminCommentController extends ControllerBase implements Controller {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/comments`, authMiddleware(Admin), this.getComment)
            .post(`${this.path}/comments/create`, authMiddleware(Admin), validationMiddleware(CommentDto), this.createComment)
            .get(`${this.path}/comments/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private getComment = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCommentService.getComment(request, response, next);
    };

    private createComment = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCommentService.createComment(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminCommentService.getDetailById(request, response, next);
    };

}

export default AdminCommentController;
