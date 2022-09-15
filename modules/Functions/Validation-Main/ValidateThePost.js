// Error
const ErrorHandler = require('../../Class/Error/ErrorHandler.js');

// Validation
const validateTheToken = require('../Validation-Partials/ValidateTheToken.js');
const validateTheUser = require('../Validation-Partials/ValidateTheUser.js');

async function validateTheRequest(userID, requestInfo) {
    let isTokenExist = false;

    if (!userID) {
        throw new Error('Missing Data', 'Please Include User ID when you want to request a data', 401);
    }
    // The Request info should have a Token for requesting or will denied
    for (const key in requestInfo) {
        if (key !== 'token' && key !== 'data') {
            throw new ErrorHandler('Unknown Data', 'Please only include required data [Token,data]', 401);
        }
    }

    const isUserExist = await validateTheUser(userID, requestInfo);
    const isTokenValidated = await validateTheToken(userID, requestInfo);

    if (isTokenValidated && isUserExist) return true;
}

module.exports = validateTheRequest;