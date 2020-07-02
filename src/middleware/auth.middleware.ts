import * as expressJwt from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import userModel from "../models/user.model";
import {NextFunction, Response} from "express";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationSessionExpired from "../exceptions/WrongAuthenticationSessionExpired";

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
            const authorization: string = request.headers['x-access-token'] || request.headers.authorization;
            const cookies = request.cookies;
            if (authorization || (cookies && cookies.Authorization)) {
                try {
                    const token: string = authorization ? authorization.slice(7, authorization.length) : cookies.Authorization;
                    const verificationResponse: any = jwt.verify(token, secret) as DataStoredInToken;
                    request.role = verificationResponse.role;
                    if (roles.length && !roles.includes(request.user.role)) {
                        // user's role is not authorized
                        return response.status(401).json({message: 'Unauthorized'});
                    }
                    const id = verificationResponse._id;
                    const user = await userModel.findById(id);
                    if (user) {
                        if ((user.session !== undefined) && (user.session !== verificationResponse.exp)) {
                            next(new WrongAuthenticationSessionExpired());
                        } else {
                            const globals: any = global;
                            globals.user = request.user = user;
                            // authentication and authorization successful
                            next();
                        }
                    } else {
                        next(new WrongAuthenticationTokenException());
                    }
                } catch (e) {
                    next(new WrongAuthenticationTokenException());
                }
            } else {
                next(new AuthenticationTokenMissingException());
            }
        }
    ];
}

