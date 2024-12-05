const express = require('express');
const router = express.Router();
const logController = require('./logController');
const path = require('path');

// const jwtToken = require('../../middleware/jwtToken');

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'logView.html');
    res.sendFile(filePath);
});
router.get('/download', logController.logDownload);
router.delete('/delete', logController.deleteLog);

module.exports = router;