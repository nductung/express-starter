import HttpException from './HttpException';

class WrongAuthenticationTokenException extends HttpException {
    constructor() {
        // super(401, 'Wrong authentication token');
        super(401, 'Mã xác thực không hợp lệ hoặc bị thiếu');
    }
}

export default WrongAuthenticationTokenException;
