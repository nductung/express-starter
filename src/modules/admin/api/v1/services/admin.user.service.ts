import {ServiceBase} from "../../base/service.base";
import userModel from '../../../../../models/user.model';
import UserTransformer from '../transformers/user.tranformer';
import proxyModel from '../../../../../models/proxy.model';
import checkProxy from './checkProxy.service';
import jobModel from '../../../../../models/job.model';
import {NextFunction, Request, Response} from 'express';

export class AdminUserService extends ServiceBase {

    constructor() {
        super(userModel);
    }

    public getUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const users = await this.getListUser(request.query);
            if (users) {
                response.send({
                                  data: users,
                                  message: "Success"
                              });
            } else {
                response.status(400).send({success: false});
            }
        } catch (e) {
            next(e);
        }
    };

    public getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await userModel.findById(request.params.id);
            if (user) {
                const jobs = await jobModel.find({"user.username": user.username});
                if (jobs.length) {
                    jobs.map((item) => {
                        return item.user = undefined;
                    });
                    response.send({
                                      data: {
                                          ...UserTransformer(user),
                                          list_jobs: [
                                              ...jobs
                                          ]
                                      },
                                      message: "Success"
                                  });
                } else {
                    response.send({
                                      data: UserTransformer(user),
                                      message: "Success"
                                  });
                }
            } else {
                response.status(400).send({message: 'User not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public createUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const username = await userModel.findOne({username: request.body.username});
            if (!username) {
                let proxyLive;

                if (request.body.proxy && request.body.proxy.address) {
                    const proxy = await proxyModel.findOne({address: request.body.proxy.address});
                    if (proxy) {
                        if (proxy.used) {
                            return response.status(400).send({message: `proxy đã được sử dụng`});
                        } else if (!proxy.status) {
                            return response.status(400).send({message: `proxy die`});
                        } else {
                            proxyLive = proxy;
                        }
                    } else {
                        console.log("Start check");
                        const check = await checkProxy(request.body.proxy.address);
                        console.log("End check");
                        if (!check) {
                            return response.status(400).send({message: `proxy die`});
                        } else {
                            const ip = request.body.proxy.address.split(':')[0];
                            const port = request.body.proxy.address.split(':')[1];
                            await this.fSaveProxy(ip, port);
                            proxyLive = await proxyModel.findOne({address: request.body.proxy.address});
                        }
                    }
                } else {
                    const proxies = await proxyModel.find({status: 1, used: 0});
                    if (proxies.length) {
                        proxyLive = proxies[Math.floor(Math.random() * proxies.length)];
                    } else {
                        return response.status(400).send({message: `Proxy die all`});
                    }
                }

                const user = {
                    username: request.body.username,
                    password: request.body.password,
                    gender: request.body.gender !== undefined ? request.body.gender : undefined,
                    post_type: request.body.post_type ? request.body.post_type : undefined,
                    proxy: request.body.proxy ? request.body.proxy : undefined,
                    created_at: new Date(),
                };

                user.proxy = proxyLive;
                proxyLive.used = 1;
                await proxyLive.save();

                if (user) {
                    const saveUser = new userModel(user);
                    await saveUser.save();
                    return response.status(200).send({
                                                         data: user,
                                                         message: "Success"
                                                     }
                    );
                }
            } else {
                return response.status(400).send({message: `Username /${request.body.username}/ đã tồn tại`});
            }
        } catch (e) {
            next(e);
        }
    };

    public fSaveProxy = async (ip: string, port: number, country: string = null) => {
        const proxy = {
            address: `${ip}:${port}`,
            ip,
            port,
            status: 1,
            used: 1,
            country: country ? country : undefined
        };
        const saveProxy = new proxyModel(proxy);
        try {
            await saveProxy.save();
        } catch (err) {
            console.log(err);
        }
    };

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
                    gender: options.gender ? options.gender : {
                        $nin: []
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], UserTransformer);
    };

}
