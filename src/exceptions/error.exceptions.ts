import {Request, Response, NextFunction} from 'express';
import UnauthorizedError from "./UnauthorizedError";

export default (err: any, request: Request, response: Response, next: NextFunction) => {

    if (typeof (err) === 'string') {
        // custom application error
        return response.status(400).send({message: err});
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return response.status(400).send({message: err.message});
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        next(new UnauthorizedError());
    }

    // default to 500 server error
    return response.status(500).send({message: err.message});

}