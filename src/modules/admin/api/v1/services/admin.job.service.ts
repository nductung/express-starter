import {ServiceBase} from "../../base/service.base";
import jobModel from '../../../../../models/job.model';
import JobTransformer from '../transformers/job.tranformer';
import runJobService from './runJob.service';
import {NextFunction, Request, Response} from 'express';

export class AdminJobService extends ServiceBase {

    constructor() {
        super(jobModel);
    }

    public getJob = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const jobs = await this.getJobCreated(request.query);
            if (jobs) {
                response.send({
                                  data: jobs,
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
            const job = await jobModel.findById(request.params.id);
            if (job) {
                response.send({
                                  data: JobTransformer(job),
                                  message: "Success"
                              });
            } else {
                response.status(400).send({message: 'Job not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public getJobCreated = async (options: any) => {
        const criteria = {
            $and: [
                {
                    _id: options.id ? options.id : {
                        $nin: []
                    }
                },
                {
                    status: options.status ? options.status : {
                        $nin: []
                    }
                },
                {
                    "user.username": options.username ? options.username : {
                        $nin: []
                    }
                },
                // {
                //     "jobs.type": options.type ? {$in: options.type.split(',')} : {
                //         $nin: []
                //     }
                // },
                {
                    "jobs.type": options.type ? options.type : {
                        $nin: []
                    }
                },
                {
                    start_date: {
                        $gte: options.start_date
                            ? new Date(options.start_date).setHours(0, 0, 0, 0)
                            : new Date(new Date("1/1/1990").setHours(0, 0, 0, 0)),
                        $lte: options.start_date
                            ? new Date(options.start_date).setHours(24, 0, 0, 0)
                            : new Date(new Date().setHours(24, 0, 0, 0)),
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], JobTransformer);
    };

    public runJob = async (request: Request, response: Response, next: NextFunction) => {
        await runJobService(request, response, next);
    };

}
