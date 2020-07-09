import HttpException from './HttpException';

class CannotSendEmailException extends HttpException {
    constructor() {
        super(400, 'Cannot send email');
    }
}

export default CannotSendEmailException;
