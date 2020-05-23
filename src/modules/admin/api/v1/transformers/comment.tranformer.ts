import {InterfaceModelComment} from '../../../../../models/comment.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const CommentTransformer = (items: InterfaceModelComment) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelComment) => {
    return {
        id: item._id,
        comments: item.comments,
        group_id: item.group_id,
        gender: item.gender,
        attitude: item.attitude,
        status: item.status,
        hashtags: item.hashtags,
        categories: item.categories,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default CommentTransformer;
