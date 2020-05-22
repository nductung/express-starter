import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import AuthenticationController from "./modules/api/v1/controllers/authentication.controller";

validateEnv();

const app = new App(
    [
        // User
        new AuthenticationController()

        // Admin

    ],
);

app.listen();
