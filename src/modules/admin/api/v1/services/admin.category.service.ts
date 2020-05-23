import {ServiceBase} from "../../base/service.base";
import categoryModel from '../../../../../models/category.model';
import CategoryTransformer from '../transformers/category.tranformer';
import {NextFunction, Request, Response} from 'express';

export class AdminCategoryService extends ServiceBase {

    constructor() {
        super(categoryModel);
    }

    public getCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categories = await this.getListCategory(request.query);
            if (categories) {
                response.send({
                                  data: categories,
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
            const category = await categoryModel.findById(request.params.id);
            if (category) {
                response.send({
                                  data: CategoryTransformer(category),
                                  message: "Success"
                              });
            } else {
                response.status(400).send({message: 'Category not found'});
            }
        } catch (e) {
            next(e);
        }
    };

    public createCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = {
                name: request.body.name,
                created_at: new Date()
            };
            if (category) {
                const savePost = new categoryModel(category);
                await savePost.save();
                response.status(200).send(
                    {
                        data: category,
                        message: "Success"
                    }
                );
            }
        } catch (e) {
            next(e);
        }
    };

    public getListCategory = async (options: any) => {
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
        return this.offsetPagination(criteria, options.limit, options.page, [], CategoryTransformer);
    };

}
