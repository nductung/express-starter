import {InterfaceModelProxy} from '../../../../../models/proxy.model';
import {TimeZoneService} from '../../../../../services/timeZone.service';

const ProxyTransformer = (items: InterfaceModelProxy) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};

const singleItem = (item: InterfaceModelProxy) => {
    return {
        id: item._id,
        address: item.address,
        port: item.port,
        status: item.status,
        used: item.used,
        ip: item.ip,
        country: item.country,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

};

export default ProxyTransformer;
