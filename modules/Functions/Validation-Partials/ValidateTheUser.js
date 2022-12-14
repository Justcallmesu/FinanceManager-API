// DB
const db = require('../../Database/Mongoose.js');

// Eror Handler
const ErrorHandler = require('../../Class/Error/ErrorHandler.js');

async function validateTheUser(userID) {
    const isExist = await db.isUserExist(userID);
    if (isExist) {
        return true;
    }
    throw new ErrorHandler('Unexisting User', 'User Info Doesnt Exist please check data again', 404);
}


module.exports = validateTheUser;