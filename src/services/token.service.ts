import * as jwt from "jsonwebtoken";

class TokenService {

    public createToken(user: any, type: boolean) {
        const expiresIn = type
            // tslint:disable-next-line:radix
            ? parseInt(process.env.TOKEN_LIFE_TIME)
            // tslint:disable-next-line:radix
            : parseInt(process.env.REFRESH_TOKEN_LIFE_TIME);
        const secret: string = process.env.JWT_SECRET;
        const dataStoredInToken: { _id: string; role: string } = {
            _id: user.id,
            role: user.role,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }

    public createEmailToken(user: any) {
        // tslint:disable-next-line:radix
        const expiresIn = parseInt(process.env.TOKEN_LIFE_TIME);
        const secret: string = process.env.EMAIL_SECRET;
        const dataStoredInToken: { _id: string } = {
            _id: user.id,
        };

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }

    public createValueToken(user: any) {
        const tokenData = this.createToken(user, true);
        const refreshTokenData = this.createToken(user, false);
        return {
            accessToken: tokenData.token,
            refreshToken: refreshTokenData.token,
        }
    }

}

export default TokenService;
