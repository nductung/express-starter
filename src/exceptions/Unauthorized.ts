import HttpException from './HttpException';

class Unauthorized extends HttpException {
    constructor() {
        super(401, "Unauthorized");
    }
}

export default Unauthorized;
