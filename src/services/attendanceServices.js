const moment = require('moment');
const now = moment();
const Attendance = require('../model/AttendanceModel');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/dbConnection');
class AttendanceServices {
    static async getById(employeeId) {
        try {
            return await Attendance.findOne({
                where: { employeeId: employeeId },
            });
        } catch (error) {
            console.error('Error in getting By Id:', error);
        }
    }

    static async createNew(newData) {
        try {
            await Attendance.create(newData);
        } catch (error) {
            console.error('Error in create  data:', error);
        }
    };

    // Raw querry
    static async selectednotTap(employeeId) {
        try {

            const result = await sequelize.query(
                `SELECT COUNT(*) as attendance_count
                FROM attendances
                WHERE employeeId = :employeeId AND DATE(date) = CURDATE();`,
                {
                    replacements: { employeeId: employeeId },
                    type: QueryTypes.SELECT,
                }
            )
            return result[0].attendance_count;
        } catch (error) {
            console.error('Error In selecting notPresentData row:', error);
        }
    };
    static async updateExitTime(employeeId, date, exitTime) {
        try {

            // console.log(exitTime);
            await sequelize.query(
                `UPDATE attendances SET exitTime =:exitTime,remark='Tap While Exit' WHERE employeeId= :employeeId AND date=:date AND TIMESTAMPDIFF(MINUTE, createdAt, NOW()) >60`,
                {
                    replacements: {
                        exitTime: exitTime,
                        employeeId: employeeId,
                        date: date
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        } catch (error) {
            console.error('Error updating status to online:', error);

        }
    };
    static async EnterExitTimeNotTap(date) {
        try {
            await sequelize.query(
                `UPDATE attendances SET exitTime = '19:00:00', remark='Not Tap While Exit' WHERE exitTime IS NULL AND date=:date`,
                {
                    replacements: { date: date },
                    type: QueryTypes.UPDATE, 
                }
            );
        } catch (error) {
            console.error('Error updating Exit time while Not tap:', error);
        }
    };
    static async updateDailyWorkHour(employeeId) {
        try {
            const query = `
            UPDATE attendances SET dailyWorkHours = CONCAT(TIME_TO_SEC(TIMEDIFF(exitTime, entryTime)) / 3600,':',) TIME_TO_SEC(TIMEDIFF(exitTime, entryTime)) / 3600 
            WHERE employeeId = :employeeId; 
            `;

            await sequelize.query(query, {
                replacements: { employeeId },
                raw: true,
            });
        } catch (error) {
            console.error('Error in updating employee Wise DailyWork Hour:', error);
        }
    }
    static async selectedDepartmentWiseData(date, department) {
        try {

            // console.log('call',date, department);
            let query = `
                SELECT
                    employees.employeeId,
                    employees.name,
                    attendances.date AS formattedDate,
                    attendances.entryTime,
                    attendances.exitTime,
                    employees.departMent
                FROM
                    employees
                JOIN
                    attendances ON employees.employeeId = attendances.employeeId
                WHERE
                    attendances.date = ?
            `;
            const replacements = [date];
            if (department !== 'ALL') {
                // console.log(department);
                query += ' AND employees.departMent = ?';
                replacements.push(department);
            }
            query += `
                 ORDER BY
                    employees.employeeId,
                    employees.name,
                    attendances.date,
                    attendances.entryTime,
                    attendances.exitTime,
                    employees.departMent;
            `;
            const results = await sequelize.query(query, {
                replacements: replacements,
                type: QueryTypes.SELECT
            });

            // console.log(results);
            return results;
        } catch (error) {
            console.error('Error in selecting department-wise data:', error);
            throw error;
        }
    }
    static async selectedEmployeeWiseData(employeeId,startDate,endDate) {
        try {
            // Define the query
            const query = `
                SELECT employees.employeeId, employees.name, attendances.date, attendances.entryTime, attendances.exitTime
                FROM employees
                JOIN attendances ON employees.employeeId = attendances.employeeId
                WHERE attendances.employeeId = :employeeId AND date BETWEEN :startDate AND :endDate
            `;

            // Execute the query using sequelize.query
            const results = await sequelize.query(query, {
                replacements: { employeeId,startDate, endDate },
                type: QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error('Error in selecting employee-wise data:', error);
            throw error
        }
    }
    static async selectWorkHourDetails(startDate, endDate) {
        try {
            const query = `
                SELECT
                    employeeId,
                    employeeName,
                    COUNT(DISTINCT date) AS workDays,
                    FLOOR(SUM(TIMESTAMPDIFF(MINUTE, entryTime, exitTime)) / 60) AS totalWorkHours,
                    SUM(TIMESTAMPDIFF(MINUTE, entryTime, exitTime)) % 60 AS totalWorkMinutes
                FROM
                    attendances
                WHERE
                    date BETWEEN :startDate AND :endDate
                GROUP BY
                    employeeId,
                    employeeName;
            `;
            const results = await sequelize.query(query, {
                replacements: { startDate, endDate },
                type: QueryTypes.SELECT
            });

            return results;
        } catch (error) {
            console.error('Error in selecting work hour details:', error);
            throw error;
        }
    }

}


module.exports = AttendanceServices;

