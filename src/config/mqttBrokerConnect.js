const mqtt = require('mqtt');
require('dotenv').config();

const client = mqtt.connect({
  host: process.env.brokerUrl,
  port: process.env.brokerPort,
  username: process.env.brokerUserName,
  password: process.env.passWord
});

// console.log({
//   host: process.env.brokerUrl,
//   port: process.env.brokerPort,
//   username: process.env.brokerUserName,
//   password: process.env.passWord
// });

// Handle errors
client.on('error', function (error) {
  // console.error('MQTT error:', error);
});



module.exports = client;
