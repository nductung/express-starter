import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import {RequestHandler} from 'express';
import HttpException from '../exceptions/HttpException';

function paramsMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
    return (req, res, next) => {
        validate(plainToClass(type, req.params), {skipMissingProperties})
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    // const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    const message = Object.values(errors[0].constraints)[0];
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };
}

export default paramsMiddleware;
