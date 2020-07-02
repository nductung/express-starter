import HttpException from './HttpException';

class WrongAuthenticationSessionExpired extends HttpException {
    constructor() {
        super(401, "Your session has expired. Please relogin");
    }
}

export default WrongAuthenticationSessionExpired;
