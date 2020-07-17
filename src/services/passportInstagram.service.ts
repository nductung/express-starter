import * as passport from "passport";
import {Strategy} from "passport-instagram";

passport.use(new Strategy({
        clientID: `${process.env.INSTAGRAM_CLIENT_ID}`,
        clientSecret: `${process.env.INSTAGRAM_CLIENT_SECRET}`,
        callbackURL: `${process.env.BASE_URL}/api/v1/oauth/instagram/callback`
    },
    (accessToken, refreshToken, profile, done) => {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        console.log(111);
        return done(null, profile);
    }));

passport.serializeUser((user, cb) => {
    console.log(111);
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    console.log(111);
    cb(null, obj);
});
