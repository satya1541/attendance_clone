const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/dbConnection');

// Define a model for Employee
const Employee = sequelize.define('employees',
    {
        slNo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tagId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        departMent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
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
module.exports = Employee;

