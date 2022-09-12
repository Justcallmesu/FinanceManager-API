// Util
const { nameREGEX, passwordREGEX, emailREGEX } = require('../Util/Regex.js');
const validateTheJSON = require('../Util/ValidateTheJson.js');

// DB
const db = require('../Database/Mongoose.js');


function getUserData(data) {
    const data = db.getUsers(data);
    console.log(data);
}


function validateTheUser(data) {
    const validated = validateTheJSON(data, (key) => {
        if (key === 'email' || key === 'password') {
            return true;
        } else {
            throw new ErrorHandler("ValidationError", "Unknown Property", 400);
        }
    }, 3);

    if (validated) {
        for (const key in data) {
            if (key === 'password' && !(passwordREGEX.test(data[key]) && data[key].length >= 5)) {
                throw new ErrorHandler("ValidationError", "Invalid Password Format", 400);
            } else if (key === 'email' && !(emailREGEX.test(data[key]))) {
                throw new ErrorHandler("ValidationError", "Invalid Email Format", 400);
            }
        }
        getUserData(data);
    }
}