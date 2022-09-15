// Class
const Response = require('../Class/Response/Payload.js');

// Functions
const validateTheRequest = require('../Functions/Validation-Main/ValidateTheRequest.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function getExpenses(userID, requestInfo, collections) {
    const isValid = await validateTheRequest(userID, requestInfo);
    const { page, itemsPerPage } = requestInfo;

    if (isValid) {
        const userData = await db[collections](userID, page, itemsPerPage);

        const serverResponse = new Response('Data SuccessFully Fetched', 200, userData);
        return serverResponse;
    }
    throw new ErrorHandler('Authentication Failed', 'Request Failed authentication Test', 401);
}

module.exports = getExpenses;