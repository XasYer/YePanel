import moment from 'moment';
import schedule from 'node-schedule';
export function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size}${sizes[i]}`;
}
export function formatDuration(inp, unit = 'seconds') {
    const duration = moment.duration(inp, unit);
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const secs = duration.seconds();
    let formatted = '';
    if (days > 0)
        formatted += `${days}天`;
    if (hours > 0)
        formatted += `${hours}时`;
    if (minutes > 0)
        formatted += `${minutes}分`;
    if (secs > 0 || formatted === '')
        formatted += `${secs}秒`;
    return formatted.trim();
}
let time = moment().format('YYYY:MM:DD');
export const getTime = () => time;
schedule.scheduleJob('0 0 0 * * ?', () => {
    time = moment().format('YYYY:MM:DD');
});
