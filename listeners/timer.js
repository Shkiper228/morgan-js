const channels = require('../config/channels.json');
const TimeShift = require('timeshift-js');

module.exports = async (client) => {
    await setInterval(() => {
        TimeShift.setTimezoneOffset(0)
        channel = client.channels.fetch(channels.advertisement);


    }, 60 * 1000);
}