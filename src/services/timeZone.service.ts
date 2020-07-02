import * as moment from "moment-timezone";

export class TimeZoneService {

    public static getCurrentDate() {
        return moment().tz("Atlantic/Azores").format();
    }

    public static getDateTimezoneVietnam(date: any) {
        date = moment(date);
        return date.tz("Asia/Ho_Chi_Minh").format()
    }

}
