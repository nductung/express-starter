import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from "./modules/api/v1/controllers/authentication.controller";
import AdminAuthenticationController from "./modules/admin/api/v1/controllers/admin.authentication.controller";
import AdminUserController from "./modules/admin/api/v1/controllers/admin.user.controller";
import OauthController from "./modules/api/v1/controllers/oauth.controller";

validateEnv();

const app = new App(
    [
        // User
        new OauthController(),
        new AuthenticationController(),

        // Admin
        new AdminAuthenticationController(),
        new AdminUserController(),

    ],
);

app.listen();
