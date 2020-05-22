import * as express from "express";
import {Base} from "./base";

export class ControllerBase extends Base {
    public router = express.Router();
    public path: string;

    constructor(path: string) {
        super();
        this.path = `/admin/api/v1`;
    }

}
