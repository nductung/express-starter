import {InterfaceModelJob} from "../../../../../models/job.model";
import {TimeZoneService} from '../../../../../services/timeZone.service';

const JobTransformer = (items: InterfaceModelJob) => {
    if (Array.isArray(items)) {
        return items.map(item => singleItem(item));
    }
    return singleItem(items);
};
const singleItem = (item: InterfaceModelJob) => {
    const data = {
        id: item._id,
        status: item.status,
        user: {
            id: item.user._id,
            username: item.user.username,
            gender: item.user.gender,
            post_type: item.user.post_type,
            proxy: item.user.proxy,
        },
        start_date: item.start_date ? TimeZoneService.convertTimeZoneVietnam(item.start_date) : undefined,
        created_at: TimeZoneService.convertTimeZoneVietnam(item.created_at),
        updated_at: item.updated_at ? TimeZoneService.convertTimeZoneVietnam(item.updated_at) : undefined,
    };

    return {
        ...data,
        jobs: [
            ...item.jobs
        ]
    };

};

export default JobTransformer;
