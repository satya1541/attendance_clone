const client = require('../config/mqttBrokerConnect');
const moment = require('moment-timezone');
const EmployeeServices = require('../services/employeeServices');
const AttendanceServices = require('../services/attendanceServices');

const topic = "chipl/attendance";
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe(topic);
});

// Handle message receptions
client.on("message", async function (topic, message) {
    try {
        const data = JSON.parse(message);
        const tagId = data.tagId;
        const existingRecord = await EmployeeServices.getByCardId(tagId);
        // console.log(existingRecord);
        let notTap;
        if (existingRecord) {
            notTap = await AttendanceServices.selectednotTap(existingRecord.employeeId);
            // console.log(notTap," ",typeof notTap);
        }
        // console.log(notTap);
        if (existingRecord && notTap== 0) {
            const newEntry = {
                employeeId: existingRecord.employeeId,
                employeeName: existingRecord.name,
                date: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
                entryTime: moment().tz('Asia/Kolkata').format('HH:mm:ss'),
            };
            await AttendanceServices.createNew(newEntry);
        } else if (existingRecord && notTap > 0) {
            // console.log('tap');
            const employeeId = existingRecord.employeeId;
            // console.log(employeeId);
            const date = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
            const exitTime = moment().tz('Asia/Kolkata').format('HH:mm:ss').trim();
            await AttendanceServices.updateExitTime(employeeId, date, exitTime);
            // await AttendanceServices.updateDailyWorkHour(employeeId);
        }

    } catch (error) {
        console.error("Error in  MQTT Message Handelling:", error);
    }
    // const time = moment().tz('Asia/Kolkata').format('HH:mm:ss');
    // console.log(`Received message on topic ${topic}: ${message.toString()}  [${time}]`);
});

