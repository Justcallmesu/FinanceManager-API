// Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Class
const DataConstructor = require('../Class/Main/UserConstructor.js');

// Util
const { nameREGEX, passwordREGEX, emailREGEX } = require('../Util/Regex.js');
const validateTheJSON = require('../Functions/Validation-Main/ValidateTheJson.js');

// DB 
const db = require('../Database/Mongoose.js')

async function isExist(data) {
    const isExist = await db.getUsers(data);
    if (isExist) {
        throw new ErrorHandler("ExistingData", "There is Existing Email that already registered", 409);
    }
    return db.addNewUsers(data);
}


function validateTheData(data) {
    const validated = validateTheJSON(data, (key) => {
        if (key !== 'name' && key !== 'password' && key !== 'email') {
            throw new ErrorHandler("ValidationError", "Unknown Property", 400);
        }
    }, 3);

    if (validated) {
        for (const key in data) {
            if (key === 'name' && !(nameREGEX.test(data[key]))) {
                throw new ErrorHandler("ValidationError", "Invalid Name Format", 400);
            } else if (key === 'password' && !(passwordREGEX.test(data[key]) && data[key].length >= 5)) {
                throw new ErrorHandler("ValidationError", "Invalid Password Format", 400);
            } else if (key === 'email' && !(emailREGEX.test(data[key]))) {
                throw new ErrorHandler("ValidationError", "Invalid Email Format", 400);
            }
        }
        const splitName = data.name.split(' ');
        const { password, email } = data;

        const cleanData = new DataConstructor(splitName[0], splitName.slice(1).join(' '), password, email);

        return isExist(cleanData);
    }
}




module.exports = validateTheData;