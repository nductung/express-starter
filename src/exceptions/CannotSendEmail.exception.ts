import HttpException from './HttpException';

class CannotSendEmailException extends HttpException {
    constructor() {
        super(500, 'Cannot send email');
    }
}

export default CannotSendEmailException;
