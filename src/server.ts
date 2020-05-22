import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from "./modules/api/v1/controllers/authentication.controller";
import AdminAuthenticationController from "./modules/admin/api/v1/controllers/admin.authentication.controller";

validateEnv();

const app = new App(
    [
        // User
        new AuthenticationController(),

        // Admin
        new AdminAuthenticationController()
    ],
);

app.listen();
