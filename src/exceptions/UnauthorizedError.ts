import HttpException from './HttpException';

class UnauthorizedError extends HttpException {
    constructor() {
        super(401, "Invalid Token");
    }
}

export default UnauthorizedError;
