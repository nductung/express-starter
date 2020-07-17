import {ServiceBase} from "../../base/service.base";
import userModel from "../../../../../models/user.model";
import userTransformer from "../transformers/user.tranformer";

export class AdminUserService extends ServiceBase {

    constructor() {
        super(userModel);
    }

    public getListUser = async (options: any) => {
        const criteria = {
            $and: [
                {
                    _id: options.id ? options.id : {
                        $nin: []
                    }
                },
                {
                    username: options.username ? options.username : {
                        $nin: []
                    }
                },
                {
                    email: options.email ? options.email : {
                        $nin: []
                    }
                },
                {
                    confirmed: options.confirmed ? options.confirmed : {
                        $nin: []
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], userTransformer);
    };

}
