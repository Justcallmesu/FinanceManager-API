// Response
const Response = require('../Class/Response/Payload.js');

//Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// DB
const db = require('../Database/Mongoose.js');

async function deleteBudget(UserID, requestInfo) {
    const { itemsID } = requestInfo;
    const itemsAmount = -(await db.getBudgetAmount(UserID, itemsID));

    if (!itemsAmount) {
        throw new ErrorHandler("Unexisting Data", "Data does not exist in the database", 404);
    }
    const status = await db.deleteUserBudget(UserID, itemsID, itemsAmount);
    const serverResponse = new Response('Data SuccessFully Deleted', 200, status);
    return serverResponse;
}

module.exports = deleteBudget;