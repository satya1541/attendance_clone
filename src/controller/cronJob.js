const moment = require('moment-timezone');
const cron = require('node-cron');
const attendanceServices = require('../services/attendanceServices');

const cronExpression = '00 23 * * *';
const timezone = 'Asia/Kolkata';

cron.schedule(cronExpression, async () => {
  try {
    const currentDate = moment().tz(timezone).format('YYYY-MM-DD');
    await attendanceServices.EnterExitTimeNotTap(currentDate);
    const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    // console.log(`Cron job executed at ${currentTime}`);
  } catch (error) {
    // Log the error or handle it as needed
    console.error(`Error during the cron job execution: ${error.message}`);
  }
}, {
  scheduled: true,
  timezone: timezone,
});