const AttendanceServices = require('../services/attendanceServices');
const excelData = require('../utils/convertToXL');
const fs = require('fs');
const attendanceDetailsDepartMentWise = async (req, res) => {
    try {
        const {
            date,
            departMent,
        } = req.query;
        // console.log(req.query);
        if (!date || !departMent) {
            return res.status(400).json({ status: 400, message: 'All fields are Required' });
        }
        const result = await AttendanceServices.selectedDepartmentWiseData(date, departMent);
        // console.log(result);
        if (result !== null && result !== undefined && result !== "null" && result.length != 0) {
            // console.log('cond');
            const fileNameFormat = `${departMent}_${date}`
            const fileDetails = await excelData.convertToExcel(result, fileNameFormat)
            //    console.log(fileDetails);
            // Set the appropriate headers for the response
            const filename = fileDetails.filename;
            const filePath = fileDetails.filePath;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('end', () => fs.unlinkSync(filePath));
        } else {
            // res.redirect('/');
            sendAlertAndRedirectResponse(res, "No data available for the selected date range. Redirecting to home page.", "/");

        }
    } catch (error) {
        console.error('Error in getting attendance details Depart Ment wise:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' ,error:error.message});
    }
};
const attendanceDetailsEmployeeWise = async (req, res) => {
    try {
        const { employeeId,
            startDate, 
            endDate  } = req.query;
        if (!employeeId) {
            return res.status(400).send({ status: 400, message: 'Employee Id  Required' });
        }
        const result = await AttendanceServices.selectedEmployeeWiseData(employeeId,startDate,endDate);
        // console.log(result);
        if (result !== null && result !== undefined && result !== "null" && result.length != 0) {
            // console.log('cond');
            const fileDetails = await excelData.convertToExcel(result, employeeId)
            //    console.log(fileDetails);
            // Set the appropriate headers for the response
            const filename = fileDetails.filename;
            const filePath = fileDetails.filePath;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('end', () => fs.unlinkSync(filePath));
        } else {
            // res.redirect('/');
            sendAlertAndRedirectResponse(res, "No data available for the selected date range. Redirecting to home page.", "/");

        }

    } catch (error) {
        console.error('Error in getting attendance details employeement wise:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error',error:error.message });
    }
};
const workingHoursDetails = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).send({ status: 400, message: 'Start Date and End Date are required' });
        }
        const result = await AttendanceServices.selectWorkHourDetails(startDate, endDate);
        // console.log(result);
        if (result !== null && result !== undefined && result !== "null" && result.length != 0) {
            const fileNameFormat = `WorkingHours_${startDate}_${endDate}`;
            const fileDetails = await excelData.convertToExcel(result, fileNameFormat)
            //    console.log(fileDetails);
            // Set the appropriate headers for the response
            const filename = fileDetails.filename;
            const filePath = fileDetails.filePath;
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('end', () => fs.unlinkSync(filePath));
        } else {
            // res.redirect('/');
            sendAlertAndRedirectResponse(res, "No data available for the selected date range. Redirecting to home page.", "/");
        }

    } catch (error) {
        console.error('Error in getting attendance details employeement wise:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error',error:error.message });
    }
};


function sendAlertAndRedirectResponse(res, message, redirectUrl) {
    const htmlResponse = `
        <html>
            <head>
                <title>Redirecting...</title>
                <script type="text/javascript">
                    alert('${message}');
                    window.location.href = '${redirectUrl}';
                </script>
            </head>
            <body>
                <noscript>
                    ${message} <a href="${redirectUrl}">Click here to return to the home page</a>
                </noscript>
            </body>
        </html>
    `;
    res.send(htmlResponse);
}

module.exports = { attendanceDetailsDepartMentWise, attendanceDetailsEmployeeWise, workingHoursDetails }