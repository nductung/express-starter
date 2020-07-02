import HttpException from './HttpException';

class AccessDeniedException extends HttpException {
    constructor() {
        super(401, 'Truy cập bị từ chối');
    }
}

export default AccessDeniedException;
