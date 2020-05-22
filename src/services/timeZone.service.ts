import * as moment from "moment-timezone";

export class TimeZoneService {

    public static convertTimeZoneVietnam(date: any) {
        date = moment(date);
        return date.tz("Asia/Ho_Chi_Minh").format();
    }

}