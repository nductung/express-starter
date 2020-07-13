import HttpException from './HttpException';

class VerifiedAccountException extends HttpException {
    constructor() {
        super(400, 'Tài khoản của bạn đã được xác minh. Xin mời đăng nhập');
    }
}

export default VerifiedAccountException;
