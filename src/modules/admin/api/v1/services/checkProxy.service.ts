import * as request from 'request';
import proxyModel from '../../../../../models/proxy.model';

export default (proxy: any) => {
    proxy = proxy.split(':');
    const ipAddress = proxy[0];
    const port = proxy[1];
    const user = 'dungnv_minet';
    const pass = '417112';

    return new Promise((resolve) => {
        const proxyUrl = "http://" + user + ":" + pass + "@" + ipAddress + ":" + port;
        const proxiedRequest = request.defaults({'proxy': proxyUrl});
        try {
            proxiedRequest.get("https://www.google.com/", async (err, resp) => {
                if (resp) {
                    console.log("TRUE", ipAddress, port);
                    resolve(true);
                }
                if (err) {
                    console.log("ERROR", ipAddress, port);

                    // change status proxy
                    const proxyFind = await proxyModel.findOne({address: `${ipAddress}:${port}`});
                    if (proxyFind) {
                        proxyFind.status = 0;
                        proxyFind.used = 0;
                        proxyFind.updated_at = new Date();
                        await proxyFind.save();
                    }

                    resolve(false);
                }
            });
        } catch (e) {
            console.log("ERROR");
            resolve(false);
        }
    });
}
