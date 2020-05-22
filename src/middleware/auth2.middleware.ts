import {NextFunction, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import authModel from "../models/auth.model";
import JwtExpiredException from "../exceptions/JwtExpiredException";

async function authMiddleware(request: any, response: Response, next: NextFunction) {
    const authorization: string = request.headers['x-access-token'] || request.headers.authorization;
    const cookies = request.cookies;
    const globals: any = global;
    const now = Date.now().valueOf() / 1000;

    if ((cookies && cookies.Authorization) || authorization) {
        const secret: string = process.env.JWT_SECRET;
        try {
            const token: string = authorization ? authorization.slice(7, authorization.length) : cookies.Authorization;
            // const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const verificationResponse: any = jwt.verify(token, secret) as DataStoredInToken;
            request.role = verificationResponse.role;

            if (typeof verificationResponse.exp !== 'undefined' && verificationResponse.exp < now) {
                next(new JwtExpiredException());
            }
            const id = verificationResponse._id;
            const user = await authModel.findById(id);

            if (user) {
                globals.user = request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;
