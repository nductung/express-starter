import HttpException from './HttpException';

class UserWithThatUsernameAlreadyExistsException extends HttpException {
    constructor(username: string) {
        super(400, `Username ${username} đã tồn tại trong hệ thống`);
    }
}

export default UserWithThatUsernameAlreadyExistsException;
