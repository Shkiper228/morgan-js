const chalk = require('chalk');

function formatCurrentDateTime() {
    const date = new Date();
    const days = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const months = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth()+ 1}`;

    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

    return `[${days}.${months}.${date.getFullYear()} ${hours}:${minutes}:${seconds}]`;
}

module.exports = class Logger {
    static log (alert = 'ALERT!', type = 'log') {
        const dateTime = formatCurrentDateTime();

        switch (type) {
            case 'log':
                console.log(chalk.cyan(`${dateTime} ${alert}`));
                break;
            case 'message':
                console.log(chalk.green(`${dateTime} ${alert}`));
                break;
            case 'warning':
                console.log(chalk.yellow(`${dateTime} ${alert}`));
                break;
            case 'error':
                console.log(chalk.red(`${dateTime} ${alert}`));
                break;
        }
    }
}