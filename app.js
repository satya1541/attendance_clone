require('dotenv').config();
const port = process.env.HTTP_PORT;
const express = require('express');
const http = require('http');
const cors = require('cors');
require('./src/config/dbConnection');
require('./src/controller/mqttMessageController');
// require('./src/controller/cronJob');
require('./src/config/logger');
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
// Define a route for the root URL 

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src' + '/views');

const apiRoutes = require("./src/routes/apiRouter");
app.use('/', apiRoutes);

const logRoute = require('./src/loggerError/logModule');
app.use("/logs", logRoute.logRoute);
app.use((req, res) => {
  let msg = `can't find that`;
  res.status(404).send({ code: 404, message: msg });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});
