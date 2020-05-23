import {InterfaceModelPost} from '../../../../../models/post.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const PostTransformer = (items: InterfaceModelPost) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelPost) => {
    return {
        id: item._id,
        image: item.image,
        caption: item.caption,
        gender: item.gender,
        status: item.status,
        hashtags: item.hashtags,
        categories: item.categories,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default PostTransformer;
