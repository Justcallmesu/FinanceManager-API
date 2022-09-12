// Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

function validateTheJSON(data, callback, propertiesRequirement) {
    let counter = 0;
    for (const key in data) {
        const status = callback(key);
        counter++;
    }

    if (counter !== propertiesRequirement) {
        throw new ErrorHandler("ValidationError", "Missing Data", 400);
    }

    return true;
}

module.exports = validateTheJSON;