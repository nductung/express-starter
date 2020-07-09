import HttpException from "./HttpException";

class CurrentPasswordIncorrectException extends HttpException {
    constructor() {
        super(400, 'Mật khẩu hiện tại không đúng');
    }
}

export default CurrentPasswordIncorrectException;
