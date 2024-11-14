const moment = require('moment-timezone');

function getCurrentTime() {
    return moment.tz("Asia/Kolkata");
}

function formatDateTime(dateTime){
    return dateTime.format('YYYY-MM-DD HH:mm:ss');
}

function convertToIST(timeString) {
    const currentDate = moment().format('YYYY-MM-DD');
    const dateTimeString = `${currentDate} ${timeString}`; 
    return moment.tz(dateTimeString, "Asia/Kolkata");
}

function convertToISTWithDate(currentDate, timeString) {
    const dateTimeString = `${currentDate} ${timeString}`;
    return moment.tz(dateTimeString, "Asia/Kolkata");
}
function getDateFromDateTime(dateTime) {
    return moment(dateTime).format('YYYY-MM-DD');
}
function convertUTCToLocalTime(utcDateTime, userTimezone = 'Asia/Kolkata') {
    return moment(utcDateTime).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {
    getCurrentTime,
    convertToIST,
    convertToISTWithDate,
    getDateFromDateTime,
    formatDateTime,
    convertUTCToLocalTime
};
