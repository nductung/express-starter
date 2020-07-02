import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
    constructor() {
        super(401, 'Tên đăng nhập hoặc mật khẩu không tồn tại trong hệ thống');
    }
}

export default WrongCredentialsException;
