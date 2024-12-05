const ExcelJS = require('exceljs');
const path = require('path');

const convertToExcel = async (result, department) => {
    const jsonData = result;
    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add header row
    const headers = Object.keys(jsonData[0]);
    worksheet.addRow(headers);
    worksheet.getRow(1).height = 40;

    headers.forEach((header, columnIndex) => {
        worksheet.getColumn(columnIndex + 1).width = 20; // Set the width in characters
    });
    // Add data rows
    jsonData.forEach((row) => {
        const values = headers.map((header) => row[header]);
        worksheet.addRow(values);
    });
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.height = 20;
    });
  
    const fileDetails = async () => {
        const filename = `${department}_Attendance.xlsx`;
        const filePath = path.join(process.cwd(), filename);
        await workbook.xlsx.writeFile(filePath);
        return {
            filename,
            filePath
        };
    };

    // Call the fileDetails function here if you want to execute it along with convertToExcel
    const details = await fileDetails();
    return details;
};
module.exports = { convertToExcel };