import AdminAuthenticationService from "../v1/services/admin.authentication.service";
import InterfaceModelUser from "../../../../interfaces/user.interface";

export class Base {
    public globals: any = global;
    public adminAuthenticationService = new AdminAuthenticationService();

    public getProfile = (): InterfaceModelUser => this.globals.user;

}
