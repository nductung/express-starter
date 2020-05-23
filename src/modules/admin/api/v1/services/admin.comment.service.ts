import {ServiceBase} from "../../base/service.base";
import CommentTransformer from '../transformers/comment.tranformer';
import commentModel from '../../../../../models/comment.model';
import {NextFunction, Request, Response} from 'express';

export class AdminCommentService extends ServiceBase {

    constructor() {
        super(commentModel);
    }

    public getComment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const comments = await this.getListComment(request.query);
            if (comments) {
                response.status(200).send({
                                              data: comments,
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
            const comment = await commentModel.findById(request.params.id);
            if (comment) {
                response.status(200).send({
                                              data: CommentTransformer(comment),
                                              message: "Success"
                                          });
            } else {
                response.status(400).send({message: 'Comment not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public createComment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const comment = {
                comments: request.body.comments,
                group_id: request.body.group_id,
                gender: request.body.gender !== undefined ? request.body.gender : undefined,
                attitude: request.body.attitude ? request.body.attitude : undefined,
                status: 0,
                created_at: new Date()
            };
            if (comment) {
                const saveComment = new commentModel(comment);
                await saveComment.save();
                response.status(200).send({
                                              data: comment,
                                              message: "Success"
                                          }
                );
            } else {
                response.status(400).send({message: 'Create comment failed'});
            }
        } catch (e) {
            next(e);
        }
    };

    public getListComment = async (options: any) => {
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
                    gender: options.gender ? options.gender : {
                        $nin: []
                    }
                },
            ]
        };
        return this.offsetPagination(criteria, options.limit, options.page, [], CommentTransformer);
    };

}
