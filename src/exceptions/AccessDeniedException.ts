import HttpException from './HttpException';

class AccessDeniedException extends HttpException {
    constructor() {
        super(403, 'Truy cập bị từ chối');
    }
}

export default AccessDeniedException;
