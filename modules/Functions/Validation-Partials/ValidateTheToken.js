// Eror Handler
const ErrorHandler = require('../../Class/Error/ErrorHandler.js');

// DB
const db = require('../../Database/Mongoose.js');

async function validateTheToken(userID, requestInfo) {
    const timeNow = new Date().getTime();
    const userToken = await db.getExpiration(userID);
    const { token } = requestInfo;

    if (userToken.token === token) {
        if (userToken.expiration <= timeNow) {
            throw new ErrorHandler('Expired Token', 'Your Token already expired please Relogin', 401);
        } else {
            return true;
        }
    }
    throw new ErrorHandler('Invalid Token', 'Your Token Doesnt Match Any Token', 401);
}

module.exports = validateTheToken;