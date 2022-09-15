// Error
const ErrorHandler = require('../../Class/Error/ErrorHandler.js')

// Functions
const validateTheUser = require('../../Functions/Validation-Partials/ValidateTheUser.js')
const validateTheToken = require('../../Functions/Validation-Partials/ValidateTheToken.js')

// Db
const db = require('../../Database/Mongoose.js');

async function validateTheRequest(UserID, requestInfo) {
    let counter = 0;
    const RequiredProperties = 3;

    for (const key in requestInfo) {
        if (key !== 'token' && key !== 'page' && key !== 'itemsPerPage') {
            throw new ErrorHandler('Unknown Data', 'Please only include required data', 401);
        }
        counter++;
    }

    if (counter !== RequiredProperties) {
        throw new ErrorHandler('Missing Data', 'Please include required data [Token,page,itemsPerPage]', 401);
    }

    const isUserExist = await validateTheUser(UserID, requestInfo);
    const isTokenValidated = await validateTheToken(UserID, requestInfo);

    if (isTokenValidated && isUserExist) return true;
}

module.exports = validateTheRequest;