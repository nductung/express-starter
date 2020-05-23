import {ServiceBase} from "../../base/service.base";
import postModel from '../../../../../models/post.model';
import PostTransformer from '../transformers/post.tranformer';
import categoryModel from '../../../../../models/category.model';
import hashtagModel from '../../../../../models/hashtag.model';
import {NextFunction, Request, Response} from 'express';

export class AdminPostService extends ServiceBase {

    constructor() {
        super(postModel);
    }

    public getPost = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const posts = await this.getListPost(request.query);
            if (posts) {
                response.send({
                                  data: posts,
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
            const post = await postModel.findById(request.params.id);
            if (post) {
                response.send({
                                  data: PostTransformer(post),
                                  message: "Success"
                              });
            } else {
                response.status(400).send({message: 'Post not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public createPost = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const post: any = {
                image: request.body.image,
                caption: request.body.caption,
                gender: request.body.gender !== undefined ? request.body.gender : undefined,
                hashtags: [],
                categories: [],
                status: 0,
                created_at: new Date()
            };
            if (request.body.categories && request.body.categories.length) {
                for (const item of request.body.categories) {
                    const category = await categoryModel.findById(item);
                    if (!category) {
                        return response.status(400).send({message: `Category by id=${item}  not found`});
                    } else {
                        post.categories.push(category);
                    }
                }
            } else {
                post.categories = undefined;
            }
            if (request.body.hashtags && request.body.hashtags.length) {
                for (const item of request.body.hashtags) {
                    const hashtag = await hashtagModel.findById(item);
                    if (!hashtag) {
                        return response.status(400).send({message: `Hashtag by id=${item}  not found`});
                    } else {
                        post.hashtags.push(hashtag);
                    }
                }
            } else {
                post.hashtags = undefined;
            }
            if (post) {
                const savePost = new postModel(post);
                await savePost.save();
                response.status(200).send(
                    {
                        data: post,
                        message: "Success"
                    }
                );
            }
        } catch (e) {
            next(e);
        }
    };

    public getListPost = async (options: any) => {
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
        return this.offsetPagination(criteria, options.limit, options.page, [], PostTransformer);
    };

}
