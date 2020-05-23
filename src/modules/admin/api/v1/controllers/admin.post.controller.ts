import {ControllerBase} from "../../base/controller.base";
import {Admin} from '../../../../../models/role.model';
import PostDto from '../validations/post/create.dto';
import IDDto from "../validations/checkID.dto";
import authMiddleware from '../../../../../middleware/auth.middleware';
import validationMiddleware from '../../../../../middleware/validation.middleware';
import paramMiddleware from '../../../../../middleware/param.middleware';
import {NextFunction, Request, Response} from 'express';

class AdminPostController extends ControllerBase {

    constructor() {
        super(__filename);
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router
            .get(`${this.path}/posts`, authMiddleware(Admin), this.getPost)
            .post(`${this.path}/posts/create`, authMiddleware(Admin), validationMiddleware(PostDto), this.createPost)
            .get(`${this.path}/posts/:id`, authMiddleware(Admin), paramMiddleware(IDDto), this.getDetailById);
    };

    private getPost = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminPostService.getPost(request, response, next);
    };

    private createPost = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminPostService.createPost(request, response, next);
    };

    private getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        await this.adminPostService.getDetailById(request, response, next);
    };

}

export default AdminPostController;
