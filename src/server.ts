import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from "./modules/api/v1/controllers/authentication.controller";
import AdminAuthenticationController from "./modules/admin/api/v1/controllers/admin.authentication.controller";
import AdminJobController from './modules/admin/api/v1/controllers/admin.job.controller';
import AdminPostController from './modules/admin/api/v1/controllers/admin.post.controller';
import AdminUserController from './modules/admin/api/v1/controllers/admin.user.controller';
import AdminProxyController from './modules/admin/api/v1/controllers/admin.proxy.controller';
import AdminCategoryController from './modules/admin/api/v1/controllers/admin.category.controller';
import AdminHashtagController from './modules/admin/api/v1/controllers/admin.hashtag.controller';
import AdminCommentController from './modules/admin/api/v1/controllers/admin.comment.controller';

validateEnv();

const app = new App(
    [
        // User
        new AuthenticationController(),

        // Admin
        new AdminAuthenticationController(),
        new AdminJobController(),
        new AdminPostController(),
        new AdminUserController(),
        new AdminCommentController(),
        new AdminProxyController(),
        new AdminCategoryController(),
        new AdminHashtagController(),
    ],
);

app.listen();
