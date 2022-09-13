// Class
const Response = require('../Class/Response/Payload.js');

// Functions
const validateTheRequest = require('../Functions/ValidateTheRequest.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function getExpenses(userID, requestInfo) {
    const userExpenses = await db.getUserExpenses(userID);

    const serverResponse = new Response('Data SuccessFully Fetched', 200, userExpenses);
    return serverResponse;
}

async function validateTheToken(userID, requestInfo) {
    const timeNow = new Date().getTime();
    const userToken = await db.getExpiration(userID);
    const { token } = requestInfo;

    if (userToken.token === token) {
        if (userToken.expiration <= timeNow) {
            return getExpenses(userID, requestInfo);
        } else {
            throw new ErrorHandler('Expired Token', 'Your Token already expired please Relogin', 401);
        }
    }

}

async function validateTheUser(userID, requestInfo) {
    const validated = validateTheRequest(userID, requestInfo);

    if (validated) {
        const isExist = await db.isUserExist(userID);
        if (isExist) {
            return validateTheToken(userID, requestInfo);
        }
        throw new ErrorHandler('Unexisting User', 'User Info Doesnt Exist please check data again', 404);
    }
}



module.exports = validateTheUser;