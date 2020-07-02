import * as expressJwt from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import userModel from "../models/user.model";
import {NextFunction, Response} from "express";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import AuthenticationTokenException from "../exceptions/AuthenticationTokenException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";

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
            const authorization: string = request.headers['x-access-token'];
            if (authorization) {
                try {
                    const token: string = authorization.slice(7, authorization.length);
                    const verificationResponse: any = jwt.verify(token, secret) as DataStoredInToken;
                    // request.role = verificationResponse.role;
                    if (roles.length && !roles.includes(request.user.role)) {
                        // user's role is not authorized
                        next(new WrongCredentialsException());
                    } else {
                        const id = verificationResponse._id;
                        const user = await userModel.findById(id);
                        if (user) {
                            const globals: any = global;
                            globals.__user = user;
                            // globals.__user = request.user = user;
                            // authentication and authorization successful
                            next();
                        } else {
                            next(new AuthenticationTokenException());
                        }
                    }
                } catch (e) {
                    next(new AuthenticationTokenException());
                }
            } else {
                next(new AuthenticationTokenException());
            }
        }
    ];
}

