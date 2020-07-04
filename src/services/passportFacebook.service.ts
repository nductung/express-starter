import * as passport from "passport";
import {Strategy} from "passport-facebook";

passport.use(new Strategy({
        clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
        clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
        callbackURL: "http://localhost:4000/api/v1/authentication/facebook/callback",
        profileFields: ['id', 'first_name', 'last_name', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb) => {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});