import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
    constructor() {
        super(400, 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
}

export default WrongCredentialsException;
