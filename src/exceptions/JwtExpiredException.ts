import HttpException from './HttpException';

class JwtExpiredException extends HttpException {
    constructor() {
        super(401, 'jwt expired');
    }
}

export default JwtExpiredException;
