// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function validateTheToken(userID, requestInfo) {
    const timeNow = new Date().getTime();
    const userToken = await db.getExpiration(userID);
    const { token } = requestInfo;

    if (userToken.token === token) {
        if (userToken.expiration <= timeNow) {
            return true;
        } else {
            throw new ErrorHandler('Expired Token', 'Your Token already expired please Relogin', 401);
        }
    }

}

async function validateTheRequest(userID, requestInfo) {
    let isTokenExist = false;

    if (!userID) {
        throw new Error('Missing Data', 'Please Include User ID when you want to request a data', 401);
    }

    // The Request info should have a Token for requesting or will denied
    for (const key in requestInfo) {
        if (key === 'token') {
            isTokenExist = true;
            break;
        }
    }

    if (!isTokenExist) {
        throw new ErrorHandler('Missing Data', 'Please include token when requesting data', 401);
    }

    return true;
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