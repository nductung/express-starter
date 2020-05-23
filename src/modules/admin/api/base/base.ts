import {InterfaceModelAuth} from "../../../../models/auth.model";
import AdminAuthenticationService from "../v1/services/admin.authentication.service";
import {AdminCategoryService} from '../v1/services/admin.category.service';
import {AdminCommentService} from '../v1/services/admin.comment.service';
import {AdminHashtagService} from '../v1/services/admin.hashtag.service';
import {AdminPostService} from '../v1/services/admin.post.service';
import {AdminProxyService} from '../v1/services/admin.proxy.service';
import {AdminUserService} from '../v1/services/admin.user.service';
import {AdminJobService} from '../v1/services/admin.job.service';

export class Base {
    public globals: any = global;
    public adminAuthenticationService = new AdminAuthenticationService();
    public adminCategoryService = new AdminCategoryService();
    public adminCommentService = new AdminCommentService();
    public adminHashtagService = new AdminHashtagService();
    public adminPostService = new AdminPostService();
    public adminProxyService = new AdminProxyService();
    public adminUserService = new AdminUserService();
    public adminJobService = new AdminJobService();

    public getProfile = (): InterfaceModelAuth => this.globals.user;

}
