import HttpException from './HttpException';

class VerifyAccountException extends HttpException {
    constructor() {
        super(400, 'Tài khoản của bạn đã được xác minh. Xin mời đăng nhập');
    }
}

export default VerifyAccountException;
