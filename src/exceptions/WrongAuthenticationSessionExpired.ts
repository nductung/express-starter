import HttpException from './HttpException';

class WrongAuthenticationSessionExpired extends HttpException {
    constructor() {
        super(401, "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại");
    }
}

export default WrongAuthenticationSessionExpired;
