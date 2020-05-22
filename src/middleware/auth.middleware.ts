import * as expressJwt from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import authModel from "../models/auth.model";
import {NextFunction, Response} from "express";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import JwtExpiredException from "../exceptions/JwtExpiredException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import Unauthorized from "../exceptions/Unauthorized";

export default (roles: any = []) => {
    const globals: any = global;
    const secret: string = process.env.JWT_SECRET;

    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (request.user)
        expressJwt({secret}),

        // authService based on user role
        async (request: any, response: Response, next: NextFunction) => {
            const authorization: string = request.headers['x-access-token'] || request.headers.authorization;
            const cookies = request.cookies;
            const now = Date.now().valueOf() / 1000;

            if ((cookies && cookies.Authorization) || authorization) {
                try {
                    const token: string = authorization ? authorization.slice(7, authorization.length) : cookies.Authorization;
                    // const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
                    const verificationResponse: any = jwt.verify(token, secret) as DataStoredInToken;
                    request.role = verificationResponse.role;

                    if (typeof verificationResponse.exp !== 'undefined' && verificationResponse.exp < now) {
                        next(new JwtExpiredException());
                    }

                    if (roles.length && !roles.includes(request.user.role)) {
                        // user's role is not authorized
                        next(new Unauthorized());
                    }
                    const id = verificationResponse._id;
                    const user = await authModel.findById(id);

                    if (user) {
                        // set request user and global variable user
                        globals.user = request.user = user;
                        // authentication and authorization successful
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
    ];
}

