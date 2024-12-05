class UserInputValidation {
    static async registration(req, res, next) {
        // console.log(req.body);
        try {
            const {
                employeeId,
                name,
                tagId,
                departMent } = req.body;

            if (!employeeId || !name || !tagId ||!departMent) {
                // console.log('1');
                return res.status(400).json({ status: 400, message: 'All fields are requires' });
            }

            next();
        } catch (error) {
            console.error('Error in validating Data:', error);
        }
    }
};

module.exports = UserInputValidation