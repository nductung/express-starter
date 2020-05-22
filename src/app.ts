import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import * as morgan from 'morgan';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as path from "path";

class App {

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

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    // public getServer() {
    //     return this.app;
    // }

    private initializeMiddlewares() {
        // this.app.use(bodyParser.json());
        // this.app.use(cookieParser());
        this.app.use(bodyParser.json({limit: '10mb'}));
        this.app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
        this.app.use(cors({credentials: true, origin: true}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(process.cwd(), 'public'), {maxAge: '7d'}));
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
