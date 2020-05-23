import {Model} from "mongoose";

export interface PaginationScrollInterface {
    pageInfo: {
        hasNextPage: boolean,
        next: string | null
    },
    edges: any[]
}

export interface PaginationOffsetInterface {
    pageInfo: {
        total: number,
        current: number,
        total_record: number,
        limit: number
    },
    edges: any[]
}

export class ServiceBase {
    public globals: any = global;
    public model: Model<any>;

    constructor(model: Model<any>) {
        this.model = model;
    }

    /**
     *
     * @param criteria
     * @param limits
     * @param selects
     * @param transformer
     * @param populate
     */
    public scrollPagination = async (criteria: object,
                                     limits: number | undefined | string, selects: string[] | null,
                                     transformer: any | undefined = undefined,
                                     populate: any | undefined = undefined): Promise<PaginationScrollInterface> => {
        if (!limits) {
            limits = 10;
        } else {
            if (typeof limits === "string") {
                limits = parseInt(limits, 10);
            }
        }
        let items = await this.model
            .find(criteria)
            .select(selects)
            .sort({_id: -1})
            .limit(limits + 1)
            .populate(populate)
            .lean()
            .exec();
        const hasNextPage = items.length >= limits + 1;
        if (hasNextPage) {
            items = items.slice(0, items.length - 1);
        }
        let next = null;
        const edges = items.map((item: any) => {
            next = Buffer.from(item._id.toString()).toString('base64');
            item._id = undefined;
            return item;
        });

        return {
            pageInfo: {hasNextPage, next},
            edges: transformer ? transformer(edges) : edges
        };
    };

    /**
     *
     * @param criteria
     * @param limits
     * @param page
     * @param selects
     * @param transformer
     * @param populate
     */
    public offsetPagination = async (criteria: object,
                                     limits: number | undefined | string,
                                     page: string | null,
                                     selects: string[] | null,
                                     transformer: any | undefined = undefined,
                                     populate: any | undefined = undefined): Promise<PaginationOffsetInterface> => {
        if (!limits) {
            limits = 10;
        } else {
            if (typeof limits === "string") {
                limits = parseInt(limits, 10);
            }
        }
        const items = await this.model
            .find(criteria)
            .select(selects)
            .sort({_id: -1})
            .limit(limits)
            .skip(limits * (parseInt(page ? page : "1", 10) - 1))
            .populate(populate)
            .lean()
            .exec();
        const totalRecord = await this.model.find(criteria).countDocuments().exec();
        return {
            pageInfo: {
                total_record: totalRecord,
                limit: limits,
                total: Math.ceil(totalRecord / limits),
                current: parseInt(page ? page : "1", 10),
            },
            edges: transformer ? transformer(items) : items
        };
    };
}
