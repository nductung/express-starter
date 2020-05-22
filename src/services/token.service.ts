import * as jwt from "jsonwebtoken";

class TokenService {

    public createToken(user: any, type: boolean) {
        const expiresIn = type
            // tslint:disable-next-line:radix
            ? (process.env.TOKEN_LIFE ? parseInt(process.env.TOKEN_LIFE) : 60 * 15)
            // tslint:disable-next-line:radix
            : (process.env.REFRESH_TOKEN_LIFE ? parseInt(process.env.REFRESH_TOKEN_LIFE) : 60 * 60 * 24);
        const secret: string = process.env.JWT_SECRET || 'SECRET';
        const dataInToken: { _id: string; role: string } = {
            _id: user.id,
            role: user.role,
        };

        return {
            expiresIn,
            token: jwt.sign(
                dataInToken,
                secret, {expiresIn}),
        };
    }

}

export default TokenService;
