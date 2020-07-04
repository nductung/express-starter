import {cleanEnv, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        GOOGLE_CLIENT_ID: str(),
        GOOGLE_CLIENT_SECRET: str(),
        JWT_SECRET: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
    });
}

export default validateEnv;
