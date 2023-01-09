// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js')

// Class
const LoginConstructor = require('../Class/Main/LoginConstructor.js');
const Payload = require('../Class/Response/Payload.js');

// Util
const { passwordREGEX, emailREGEX } = require('../Util/Regex.js');
const validateTheJSON = require('../Functions/Validation-Main/ValidateTheJson.js');

// DB
const db = require('../Database/Mongoose.js');

function matchData(userData, loginInfo) {
    const { _id, firstname, lastname, token } = userData;
    const userInfo = new LoginConstructor(_id, firstname, lastname, token);

    if (userData.password === loginInfo.password) {
        const Response = new Payload("Data SuccessFully Fetched And Authenticated", 200, userInfo);
        return Response;
    }

    throw new ErrorHandler("Authentication Failed", "Password Doesnt Match", 401);
}


async function getUserData(data) {
    await db.updateUsersToken(data);
    const userData = await db.getUsers(data);

    if (userData) {
        return matchData(userData, data);
    } else {
        throw new ErrorHandler("Unexisting Data", "There is no Matching Email", 404);
    }
}


async function validateTheUser(data) {
    const validated = await validateTheJSON(data, (key) => {
        if (key !== 'email' && key !== 'password') {
            throw new ErrorHandler("ValidationError", "Unknown Property", 400);
        }
    }, 2);

    if (validated) {
        for (const key in data) {
            if (key === 'password' && !(passwordREGEX.test(data[key]) && data[key].length >= 8)) {
                throw new ErrorHandler("ValidationError", "Invalid Password Format", 400);
            } else if (key === 'email' && !(emailREGEX.test(data[key]))) {
                throw new ErrorHandler("ValidationError", "Invalid Email Format", 400);
            }
        }
        return getUserData(data);
    }
}

module.exports = validateTheUser;