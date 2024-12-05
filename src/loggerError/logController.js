const fs = require('fs');
const path = require('path');


const logDownload = (req, res) => {
    const password = req.headers.authorization.split(' ')[1];
    if (!password || password !== '123@biswa') {
        res.status(401).send('Unathorised to acess log');
    } else {
        const logFilePath = path.join(__dirname, '..', '..', 'log', 'error.log');
        fs.access(logFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Error accessing log file:', err);
                res.status(404).send('Log file not found');
                return;
            }
            const fileStream = fs.createReadStream(logFilePath);
            fileStream.pipe(res);
        });
    }
};

const deleteLog = (req, res) => {
    const password = req.headers.authorization.split(' ')[1];
    if (!password || password !== '123@biswa') {
        res.status(401).send('Unathorised to acess log');
    } else {
        const logFilePath = path.join(__dirname, '..', '..', 'log', 'error.log');
        fs.access(logFilePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Log file does not exist
                console.error('Log file not found:', err);
                res.status(404).send('Log file not found');
            } else {
                // Log file exists, clear its content
                fs.writeFile(logFilePath, '', (err) => {
                    if (err) {
                        console.error('Error clearing log file:', err);
                        res.status(500).send('Error clearing log file');
                    } else {
                        res.send('Log file content cleared successfully');
                    }
                });
            }
        });
    }
};

module.exports = {
    logDownload,
    deleteLog
}