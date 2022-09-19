// Response
const Response = require('../Class/Response/Payload.js');

//Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// DB
const db = require('../Database/Mongoose.js');

async function deleteExpenses(UserID, requestInfo) {
    const { itemsID } = requestInfo;
    const itemsAmount = -(await db.getExpensesAmount(UserID, itemsID));

    if (!itemsAmount) {
        throw new ErrorHandler("Unexisting Data", "Data does not exist in the database", 404);
    }

    const status = await db.deleteUserExpenses(UserID, itemsID, itemsAmount);
    const serverResponse = new Response('Data SuccessFully Deleted', 200, status);
    return serverResponse;
}

module.exports = deleteExpenses;