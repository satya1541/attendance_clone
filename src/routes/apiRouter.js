const express = require('express');
const path = require('path');
const router = express.Router();
const userAuth = require('../controller/userAuthController');
const attendanceController = require('../controller/attendanceController');
const UserInputValidation = require('../middleware/userInputValidation');
const EmployeeServices = require('../services/employeeServices');
const AttendanceServices = require('../services/attendanceServices');
router.get('/', async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await EmployeeServices.selectedEmployeeIdAndName();
    res.render('index', { employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/addEmployee', async (req, res) => {
  try {
    res.render('addEmployee');
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/allEmployee', async (req, res) => {
  try {
    res.render('allEmployee');
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/employeeRegistration', UserInputValidation.registration, userAuth.registration);
router.put('/employeeDetailsUpdate/:id', userAuth.update);
router.get('/employeeDetaisDepartMentWise', userAuth.getDetailsDepartMentWise);

// ATTENDANCE TABLE 
router.get('/attendanceDetailsDepartMentWise', attendanceController.attendanceDetailsDepartMentWise);
router.get('/attendanceDetailsEmployeeWise', attendanceController.attendanceDetailsEmployeeWise);
router.get('/attendanceDetailsWorkingHours', attendanceController.workingHoursDetails);

// Show AttendanceRender
router.get('/daily', async (req, res) => {
  try {
    const {
      department,
      date
    } = req.query;
    // console.log(req.query);
    if (!department ||
      !date) {
      res.status(400).json({ status: 400, message: "params Required" })
    } else {
      const data = await AttendanceServices.selectedDepartmentWiseData(date, department);
      // console.log(data);
      res.render('dailyAttendance', { data,department,date });
    }
  } catch (error) {
    console.error('Error in getDailyDepartment:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/total', async (req, res) => {
  try {
    const {
      startDate,
      endDate
    } = req.query;
    // console.log(req.query);
    if (!startDate||
      !endDate) {
      res.status(400).json({ status: 400, message: "params Required" })
    } else {
      const data = await AttendanceServices.selectWorkHourDetails(startDate,endDate);
      // console.log(data);
      res.render('totalAttendance', { data,startDate,endDate});
    }
  } catch (error) {
    console.error('Error in getTotalAttendance:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/employee', async (req, res) => {
  try {
    const {
      employeeId,
      startDate,
      endDate
    } = req.query;
    // console.log(req.query);
    if (!employeeId ||
      !startDate ||
      !endDate) {
      res.status(400).json({ status: 400, message: "params Required" })
    } else {
      const data = await AttendanceServices.selectedEmployeeWiseData(employeeId,startDate,endDate);
      // console.log(data);
      res.render('employeeAttendance', { data,employeeId,startDate,endDate});
    }
  } catch (error) {
    console.error('Error in getEmployeeAttendance:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;