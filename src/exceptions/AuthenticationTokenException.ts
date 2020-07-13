import HttpException from './HttpException';

class AuthenticationTokenException extends HttpException {
    constructor() {
        super(400, 'Mã xác thực không hợp lệ hoặc bị thiếu');
    }
}

export default AuthenticationTokenException;
