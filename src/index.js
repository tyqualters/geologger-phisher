const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios').default;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ipsLogged = [];
let ipsGeoed = [];

app.get('/', (req, res) => {
    if (!ipsLogged.includes(req.ip)) {
        console.log(
            'New connection:\n'
            + `\tIP address: ${/*req.socket.remoteAddress*/ req.ip}\n`
        );
        ipsLogged.push(req.ip)
    }
    res.sendFile(path.join(__dirname, '../public_html/index.html'));
});

async function logWithGeo(req) {
    console.log('Getting data...');
    axios.get(`https://ipwhois.app/json/${req.ip}`).then(response => console.log(
        'New data:\n'
        + `\tIP address: ${req.ip}\n`
        + `\tLocation: ${response.data.success ? response.data.city : null}, ${response.data.success ? response.data.region : null}, ${response.data.success ? response.data.country : null}, ${response.data.success ? response.data.continent : null}\n`
        + `\tGeolocation: ${response.data.success ? response.data.latitude : null}°, ${response.data.success ? response.data.longitude : null}°\n`
        + `\tTime Zone: ${response.data.timezone}\n`
        + `\tOrganization: ${response.data.success ? response.data.org : null}\n`
        + `\tISP: ${response.data.success ? response.data.isp : null}\n`
        + `\tData: ${JSON.stringify(req.body)}`
    ), () => { });
}

app.post('/analytics', (req, res) => {
    if (!ipsGeoed.includes(req.ip)) {
        logWithGeo(req);
        ipsGeoed.push(req.ip)
    }
    res.end();
});

app.listen(80, () => {
    console.log('Online!');
});