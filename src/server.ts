import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        // User

        // Admin

    ],
);

app.listen();
