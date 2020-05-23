import {ServiceBase} from "../../base/service.base";
import proxyModel from '../../../../../models/proxy.model';
import ProxyTransformer from '../transformers/proxy.tranformer';
import checkProxyService from './checkProxy.service';
import {NextFunction, Request, Response} from 'express';

export class AdminProxyService extends ServiceBase {
    constructor() {
        super(proxyModel);
    }

    public getProxy = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const proxies = await this.getListProxy(request.query);
            if (proxies) {
                response.send({
                                  data: proxies,
                                  message: "Success"
                              });
            } else {
                response.status(400).send({success: false});
            }
        } catch (e) {
            next(e);
        }
    };

    public createProxy = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.body.address.split(':').length !== 2) {
                return response.status(400).send({message: "Proxy không đúng định dạng"});
            }

            const findProxy = await proxyModel.findOne({address: request.body.address});
            if (findProxy) {
                return response.status(400).send({message: "Proxy đã tồn tại"});
            }

            console.log("Start check");
            const check = await checkProxyService(request.body.address);
            console.log("End check");
            if (!check) {
                return response.status(400).send({message: `Proxy die`});
            }

            const proxy = {
                address: request.body.address,
                ip: request.body.address.split(':')[0],
                // tslint:disable-next-line:radix
                port: parseInt(request.body.address.split(':')[1]),
                country: request.body.country ? request.body.country : undefined,
                status: 1,
                used: 0,
            };

            if (proxy) {
                const saveProxy = new proxyModel(proxy);
                await saveProxy.save();
                response.status(200).send({
                                              data: proxy,
                                              message: "Success"
                                          });
            }
        } catch (e) {
            next(e);
        }
    };

    public getDetailById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const proxy = await proxyModel.findById(request.params.id);
            if (proxy) {
                response.status(200).send({
                                              data: ProxyTransformer(proxy),
                                              message: "Success"
                                          });
            } else {
                response.status(400).send({message: 'Proxy not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public getListProxy = async (options: any) => {
        const criteria = {
            $and: [
                {
                    _id: options.id ? options.id : {
                        $nin: []
                    }
                },
                {
                    address: options.address ? options.address : {
                        $nin: []
                    }
                },
                {
                    ip: options.ip ? options.ip : {
                        $nin: []
                    }
                },
                {
                    port: options.port ? options.port : {
                        $nin: []
                    }
                },
                {
                    status: options.status ? options.status : {
                        $nin: []
                    }
                },
                {
                    used: options.used ? options.used : {
                        $nin: []
                    }
                },
                // {
                //     country: options.country ? {$in: options.country.split(',')} : {
                //         $nin: []
                //     }
                // },
                {
                    country: options.country ? options.country : {
                        $nin: []
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], ProxyTransformer);
    };

}
