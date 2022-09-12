// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js')

// Class
const LoginConstructor = require('../Class/Main/LoginConstructor.js');
const Payload = require('../Class/Response/Payload.js');

// Util
const { passwordREGEX, emailREGEX } = require('../Util/Regex.js');
const validateTheJSON = require('../Functions/ValidateTheJson.js');

// DB
const db = require('../Database/Mongoose.js');


async function getUserData(data) {
    await db.updateUsersToken(data);
    const userData = await db.getUsers(data);

    if (userData) {
        const { firstname, lastname, token, _id } = userData;

        const UserInfo = new LoginConstructor(_id, firstname, lastname, token);
        const Response = new Payload("Data Successfully Fetched", 200, UserInfo);

        return Response;
    } else {
        throw new ErrorHandler("Unexisting Data", "There is no Matching Email or Password", 404);
    }
}


function validateTheUser(data) {
    const validated = validateTheJSON(data, (key) => {
        if (key !== 'email' && key !== 'password') {
            throw new ErrorHandler("ValidationError", "Unknown Property", 400);
        }
    }, 2);

    if (validated) {
        for (const key in data) {
            if (key === 'password' && !(passwordREGEX.test(data[key]) && data[key].length >= 5)) {
                throw new ErrorHandler("ValidationError", "Invalid Password Format", 400);
            } else if (key === 'email' && !(emailREGEX.test(data[key]))) {
                throw new ErrorHandler("ValidationError", "Invalid Email Format", 400);
            }
        }
        return getUserData(data);
    }
}

module.exports = validateTheUser;