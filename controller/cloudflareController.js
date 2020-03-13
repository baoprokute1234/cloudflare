const genString = require('../common/common.js').genString;
const axios = require('axios').default;
const path = require('path');

module.exports = app => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    })

    app.post('/:referrer', (req, res) => {
        const install_id = genString(11)
        const postData = {
            key: `${genString(43)}=`,
            install_id: install_id,
            fcm_token: `${install_id}:APA91b${genString(134)}`,
            referrer: req.params.referrer,
            warp_enabled: false,
            tos: new Date().toISOString().replace("Z", "+07:00"),
            type: "Android",
            locale: "zh_CN"
        };

        const options = {
            hostname: "api.cloudflareclient.com",
            port: 443,
            path: "/v0a745/reg",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Host: "api.cloudflareclient.com",
                Connection: "Keep-Alive",
                "Accept-Encoding": "gzip",
                "User-Agent": "okhttp/3.12.1",
                "Content-Length": postData.length
            }
        };

        const url = 'https://api.cloudflareclient.com/v0a745/reg';

        axios.post(url, postData, options)
            .then(result => res.json({
                status: result.status,
                statusText: result.statusText
            }))
            .catch(result => res.json({
                status: result.response.status,
                statusText: result.response.statusText
            }))
    })
}