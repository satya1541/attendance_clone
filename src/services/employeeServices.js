const Employee = require('../model/employeeModel');
const { QueryTypes } = require('sequelize');
const { sequelize, coreMysqlConnection } = require('../config/dbConnection')
class EmployeeServices {
    static async getById(id) {
        try {
            return await Employee.findOne({
                where: { employeeId: id },
            });
        } catch (error) {
            console.error('Error in getting By Id:', error);
        }
    };

    static async getByCardId(tagId) {
        try {
            return await Employee.findOne({
                where: { tagId: tagId },
            });
        } catch (error) {
            console.error('Error in getting By tagId:', error);
        }
    };

    static async createNew(newData) {
        try {
            await Employee.create(newData);
        } catch (error) {
            console.error('Error in create  data:', error);
        }
    };

    static async getAllData() {
        try {
            return await Employee.findAll();
        } catch (error) {
            console.error('Error in get data:', error);
        }
    };
    static async updateValue(id, name, tagId) {
        try {
            await Employee.update(
                {
                    name: name,

                },
                {
                    where: { employeeId: id }
                })
        } catch (error) {
            console.error('Error in update Data:', error);
        }
    };
    static async selectedDepartMentWiseEmployee(departMent) {
        try {
            let query;
            if(departMent==='ALL'){
                query="SELECT employeeId,name,tagId,departMent FROM employees ORDER BY employeeId"
            }else{
                query=`SELECT employeeId, name, tagId, departMent
                FROM employees
                WHERE departMent = :departMent
                ORDER BY employeeId;
                `
            }
            return await sequelize.query(query,
                {
                    replacements: { departMent: departMent },
                    type: QueryTypes.SELECT,
                }
            )
        } catch (error) {
            console.error('Error In selecting Department wise data row:', error);
        }
    };
    static async selectedTagid() {
        try {

            const result = await sequelize.query(
                "SELECT tagId FROM employees;",
                {
                    type: QueryTypes.SELECT,
                }
            )
            // console.log(result);
        } catch (error) {
            console.error('Error In selecting Department wise data row:', error);
        }
    };
    static async selectedEmployeeIdAndName() {
        try {

            const result = await sequelize.query(
                "SELECT employeeId, name FROM employees WHERE status=1 ORDER BY employeeId,name;",
                {
                    type: QueryTypes.SELECT,
                }
            )
            // console.log(result);
            return result;
        } catch (error) {
            console.error('Error In selecting Department wise data row:', error);
        }
    };
}

module.exports = EmployeeServices;

