import HttpException from './HttpException';

class AccountNotActiveException extends HttpException {
    constructor() {
        super(400, 'Vui lòng kích hoạt tài khoản của bạn trước khi đăng nhập');
    }
}

export default AccountNotActiveException;
