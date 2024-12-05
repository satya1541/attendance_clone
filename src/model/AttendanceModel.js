const { DataTypes, STRING } = require('sequelize');
const {sequelize} = require('../config/dbConnection');

// Define a model for Employee
const Attendance = sequelize.define('attendances',
    {
        slNo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        employeeName: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull:true,
        },
        entryTime: {
            type: DataTypes.TIME,
            allowNull:true,
        },
        exitTime: {
            type: DataTypes.TIME,
            allowNull:true,
        },
        remark: {
            type: STRING,
            allowNull:true,
        },
    },
    {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
);

 sequelize.sync()
     .then(() => {
         console.log('tables synced!');
     })
     .catch((error) => {
         console.error('Error syncing database:', error);
     });
module.exports =Attendance ;

