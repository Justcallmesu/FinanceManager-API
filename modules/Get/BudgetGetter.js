// Validation
const Validation = require('../Functions/ValidateTheRequest.js');

// Class
const Response = require('../Class/Response/Payload.js');

// Functions
const validateTheRequest = require('../Functions/ValidateTheRequest.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function getBudget(userID, requestInfo) {
    const isValid = await validateTheRequest(userID, requestInfo);
    if (isValid) {
        const userExpenses = await db.getUserBudget(userID);

        const serverResponse = new Response('Data SuccessFully Fetched', 200, userExpenses);
        return serverResponse;
    }
    throw new ErrorHandler('Authentication Failed', 'Request Failed authentication Test', 401);
}



module.exports = getBudget;