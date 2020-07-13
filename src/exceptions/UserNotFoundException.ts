import HttpException from './HttpException';

class UserNotFoundException extends HttpException {
    constructor() {
        super(400, 'Không tìm thấy người dùng');
    }
}

export default UserNotFoundException;
