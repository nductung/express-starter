import {ServiceBase} from "../../base/service.base";
import hashtagModel from '../../../../../models/hashtag.model';
import HashtagTransformer from '../transformers/hashtag.tranformer';
import {NextFunction, Request, Response} from 'express';

export class AdminHashtagService extends ServiceBase {

    constructor() {
        super(hashtagModel);
    }

    public getHashtag = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const hashtags = await this.getListHashtag(request.query);
            if (hashtags) {
                response.send({
                                  data: hashtags,
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
            const hashtag = await hashtagModel.findById(request.params.id);
            if (hashtag) {
                response.send({
                                  data: HashtagTransformer(hashtag),
                                  message: "Success"
                              });
            } else {
                response.status(400).send({message: 'Hashtag not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public createHashtag = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const hashtag = {
                name: request.body.name,
                created_at: new Date()
            };
            if (hashtag) {
                const savePost = new hashtagModel(hashtag);
                await savePost.save();
                response.status(200).send(
                    {
                        data: hashtag,
                        message: "Success"
                    }
                );
            }
        } catch (e) {
            next(e);
        }
    };

    public getListHashtag = async (options: any) => {
        const criteria = {
            $and: [
                {
                    _id: options.id ? options.id : {
                        $nin: []
                    }
                },
                {
                    name: options.name ? options.statnameus : {
                        $nin: []
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], HashtagTransformer);
    };

}
