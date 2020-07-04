import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as morgan from 'morgan';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as path from "path";
import * as passport from "passport";
import cookieSession = require("cookie-session");

// tslint:disable-next-line:no-var-requires
require('./services/passportGoogle.service');
// tslint:disable-next-line:no-var-requires
require('./services/passportFacebook.service');

class App {

    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        App.connectToTheDatabase().then();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();

        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
            res.header('Access-Control-Allow-Headers', '*');
            next();
        });

    }

    private static async connectToTheDatabase() {
        const connectionOptions = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        // tslint:disable-next-line:max-line-length
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_PATH}`, connectionOptions)
            .then(() => console.log('MongoDB Connected'))
            .catch((err) => {
                console.log(err);
            });
    }

    public listen() {
        this.app.listen(process.env.PORT ? process.env.PORT : 4000, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    private initializeMiddlewares() {
        // For an actual app you should configure this with an experation time, better keys, proxy and secure
        this.app.use(cookieSession({
            name: 'session',
            keys: ['key1', 'key2']
        }));
        // Initialize Passport and restore authentication state, if any, from the
        // session.
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cors({credentials: true, origin: true}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(process.cwd(), 'public')));
        this.app.use(morgan('dev'));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

}

export default App;
