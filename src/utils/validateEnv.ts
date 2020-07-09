import {cleanEnv, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        PORT: port(),
        JWT_SECRET: str(),

        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),

        GOOGLE_CLIENT_ID: str(),
        GOOGLE_CLIENT_SECRET: str(),

        FACEBOOK_CLIENT_ID: str(),
        FACEBOOK_CLIENT_SECRET: str(),

        MAIL_USER: str(),
        MAIL_PASSWORD: str(),
        MAIL_HOST: str(),
        MAIL_PORT: str(),
    });
}

export default validateEnv;
