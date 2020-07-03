import * as passport from 'passport';
import {Strategy} from 'passport-google-oauth20'

passport.serializeUser((user: any, done: any) => {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
    /*
    Instead of user this function usually recives the id
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new Strategy({
        clientID: "320186379838-4acv2aqj41i4sj659emj1fbaboisn7ah.apps.googleusercontent.com",
        clientSecret: "0qOTEGHoz_dwAy43Z1rHlZf7",
        callbackURL: "http://localhost:4000/api/v1/authentication/google/callback"
    },
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
        /*
         use the profile info (mainly profile id) to check if the user is registerd in ur db
         If yes select the user and pass him to the done callback
         If not create the user and then select him and pass to callback
        */
        return done(null, profile);
    }
));
