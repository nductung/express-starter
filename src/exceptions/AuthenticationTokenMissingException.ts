import HttpException from './HttpException';

class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        // super(401, 'Authentication token missing');
        super(401, 'Mã xác thực không hợp lệ hoặc bị thiếu');
    }
}

export default AuthenticationTokenMissingException;
