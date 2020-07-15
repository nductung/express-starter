import {cleanEnv, num, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: port(),
        JWT_SECRET: str(),

        TOKEN_LIFE_TIME: num(),
        REFRESH_TOKEN_LIFE_TIME: num(),

        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),

        MAIL_USER: str(),
        MAIL_PASSWORD: str(),
        MAIL_HOST: str(),
        MAIL_PORT: str(),

        GOOGLE_CLIENT_ID: str(),
        GOOGLE_CLIENT_SECRET: str(),

        FACEBOOK_CLIENT_ID: str(),
        FACEBOOK_CLIENT_SECRET: str(),
    });
}

export default validateEnv;
