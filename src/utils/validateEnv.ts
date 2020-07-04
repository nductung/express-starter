import {cleanEnv, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
        GOOGLE_CLIENT_ID: str(),
        GOOGLE_CLIENT_SECRET: str(),
        FACEBOOK_CLIENT_ID: str(),
        FACEBOOK_CLIENT_SECRET: str(),
    });
}

export default validateEnv;
