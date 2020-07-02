import HttpException from './HttpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email: string) {
        super(400, `Email ${email} đã tồn tại trong hệ thống`);
    }
}

export default UserWithThatEmailAlreadyExistsException;
