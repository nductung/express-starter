import AdminAuthenticationService from "../v1/services/admin.authentication.service";
import InterfaceModelUser from "../../../../interfaces/user.interface";
import {AdminUserService} from "../v1/services/admin.user.service";

export class Base {
    public globals: any = global;
    public adminAuthenticationService = new AdminAuthenticationService();
    public adminUserService = new AdminUserService();

    public getProfile = (): InterfaceModelUser => this.globals.__user;

}
