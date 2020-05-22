import {InterfaceModelAuth} from "../../../../models/auth.model";
import AdminAuthenticationService from "../v1/services/admin.authentication.service";

export class Base {
    public globals: any = global;
    public adminAuthenticationService: any = new AdminAuthenticationService();

    public getProfile = (): InterfaceModelAuth => this.globals.user;

}
