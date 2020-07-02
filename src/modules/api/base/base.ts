import AuthenticationService from "../v1/services/authentication.service";
import InterfaceModelUser from "../../../interfaces/user.interface";

export class Base {
    public globals: any = global;
    public authenticationService = new AuthenticationService();

    public getProfile = (): InterfaceModelUser => this.globals.user;

}
