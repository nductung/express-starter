import {InterfaceModelUser} from '../../../../../models/user.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const UserTransformer = (items: InterfaceModelUser) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelUser) => {
    return {
        id: item._id,
        username: item.username,
        password: item.password,
        gender: item.gender,
        post_type: item.post_type,
        proxy: item.proxy,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default UserTransformer;
