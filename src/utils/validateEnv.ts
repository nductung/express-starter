import {cleanEnv, num, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
        TOKEN_LIFE: num(),
        REFRESH_TOKEN_LIFE: num(),
    });
}

export default validateEnv;
