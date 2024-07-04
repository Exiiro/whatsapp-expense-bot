const cron = require('node-cron');
const { reminderMessage, sendLongMessage } = require('./config');
const { getDailyAdvice } = require('./openai');

const setupCronJobs = (sock) => {
    // Schedule for sending monthly reminder on the 1st of each month at 9 AM KSA time (KSA is UTC+3)
    cron.schedule('0 9 1 * *', async () => {
        try {
            await sock.sendMessage(process.env.GROUP_ID, { text: reminderMessage });
            console.log('Monthly reminder sent successfully.');
        } catch (error) {
            console.error('Error sending monthly reminder:', error);
        }
    }, {
        timezone: "Asia/Riyadh"
    });

    // Schedule for sending daily advice at 9 PM KSA time (KSA is UTC+3)
    cron.schedule('0 21 * * *', async () => {
        try {
            const advice = await getDailyAdvice();
            await sendLongMessage(sock, process.env.GROUP_ID, advice);
            console.log('Daily advice sent successfully.');
        } catch (error) {
            console.error('Error sending daily advice:', error);
        }
    }, {
        timezone: "Asia/Riyadh"
    });
};

module.exports = { setupCronJobs };