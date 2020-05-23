import {InterfaceModelCategory} from '../../../../../models/category.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const CategoryTransformer = (items: InterfaceModelCategory) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelCategory) => {
    return {
        id: item._id,
        name: item.name,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default CategoryTransformer;
