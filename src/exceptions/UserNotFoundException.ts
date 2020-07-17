import HttpException from './HttpException';

class UserNotFoundException extends HttpException {
    constructor() {
        super(400, 'Người dùng không tìm thấy');
    }
}

export default UserNotFoundException;
