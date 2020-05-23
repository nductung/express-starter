import {InterfaceModelHashtag} from '../../../../../models/hashtag.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const HashtagTransformer = (items: InterfaceModelHashtag) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelHashtag) => {
    return {
        id: item._id,
        name: item.name,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default HashtagTransformer;
