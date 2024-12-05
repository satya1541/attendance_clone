const EmployeeServices = require('../services/employeeServices');
const registration = async (req, res) => {
    try {
        // console.log(req.body);
        const {
            employeeId,
            name,
            tagId,
            departMent,
        } = req.body;
        const existingUser = await EmployeeServices.getById(employeeId);
        const existingCardId = await EmployeeServices.getByCardId(tagId);
        if (existingUser || existingCardId) {
            return res.status(400).json({ status: 400, message: 'User is already registered.' });
        }
        await EmployeeServices.createNew({
            employeeId,
            name,
            tagId,
            departMent,
            createdBy: 'registration', // You can set this to any value, depending on your requirements
        });
        return res.status(201).json({ status: 200, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const update = async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.params.id);
        const allowedFields = [
            'name',
            'tagId',
            'departMent',];
        const employeeId = req.params.id;
        // console.log(employeeId);
        // console.log(req.body);
        const updateFields = req.body;
        const user = await EmployeeServices.getById(employeeId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        for (const [key, value] of Object.entries(updateFields)) {
            if (allowedFields.includes(key)) {
                // console.log(key,value);
                if (!value.trim()) {
                    // console.log('1');
                    return res.status(400).json({ message: `Invalid value for field: ${key}` });
                } else {
                    user[key] = value;
                }
            } else {
                return res.status(400).json({ message: `Invalid field: ${key}` });
            }
        }
        user.updatedBy = 'self';
        await user.save();
        return res.status(200).json({ message: 'value Update sucessfully', user: user });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDetailsDepartMentWise = async (req, res) => {
    try {
        const { departMent } = req.query;
        // console.log(departMent);

        if (!departMent) {
            return res.status(400).json({ status: 400, message: 'DepartMent Field Required' });
        }

        const user = await EmployeeServices.selectedDepartMentWiseEmployee(departMent);

        // Check if 'user' is an array before sending it as a response
        if (!Array.isArray(user)) {
            throw new Error('Service function did not return an array');
        }

        // console.log(user);
        return res.status(200).json({ status: 200, message: 'DepartMent Wise Data', employees: user });
    } catch (error) {
        console.error('Error in getting user Details', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    registration,
    update,
    getDetailsDepartMentWise
}