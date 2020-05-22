import TokenData from "../interfaces/tokenData.interface";

class CookieService {

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

}

export default CookieService;
