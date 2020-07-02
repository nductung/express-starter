import * as jwt from "jsonwebtoken";

class TokenService {

    public createToken(user: any, type: boolean) {
        const expiresIn = type ? 60 * (60 * 6) : 60 * (60 * 24);
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

}

export default TokenService;
