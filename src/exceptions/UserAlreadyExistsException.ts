import HttpException from './HttpException';

class UserAlreadyExistsException extends HttpException {
    constructor(type: string, username: string) {
        super(400, `${type} ${username} đã tồn tại trong hệ thống`);
    }
}

export default UserAlreadyExistsException;
