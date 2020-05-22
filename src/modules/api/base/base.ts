import {InterfaceModelAuth} from "../../../models/auth.model";
import AuthenticationService from "../v1/services/authentication.service";

export class Base {
    public globals: any = global;
    public authenticationService: any = new AuthenticationService();

    public getProfile = (): InterfaceModelAuth => this.globals.user;

}
