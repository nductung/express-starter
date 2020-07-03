import * as expressJwt from 'express-jwt';
import userModel from "../models/user.model";
import {NextFunction, Response} from "express";
import AuthenticationTokenException from "../exceptions/AuthenticationTokenException";
import AccessDeniedException from "../exceptions/AccessDeniedException";
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from "../interfaces/dataStoredInToken";

export default (roles: any = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const secret: string = process.env.JWT_SECRET;
    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({secret, algorithms: ['HS256']}),

        // authorize based on user role
        async (request: any, response: Response, next: NextFunction) => {

            const authorization: string = request.headers.authorization;
            if (authorization) {
                const token: string = authorization.slice(7, authorization.length);
                const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
                if (roles.length && !roles.includes(verificationResponse.role)) {
                    // user's role is not authorized
                    next(new AccessDeniedException());
                } else {
                    const user = await userModel.findById(verificationResponse._id);
                    if (user) {
                        const globals: any = global;
                        globals.__user = request.user = user;
                        // authentication and authorization successful
                        next();
                    } else {
                        next(new AuthenticationTokenException());
                    }
                }
            } else {
                next(new AuthenticationTokenException());
            }
        }
    ];
}

