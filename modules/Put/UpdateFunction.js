// Response
const Response = require('../Class/Response/Payload.js');

// Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// DB
const db = require('../Database/Mongoose.js');

async function updateFunctions(UserID, requestInfo, PutTarget) {

    validateTheToken(UserID, requestInfo);
    validateTheUser(UserID);

    let getter = null;
    let method = null;

    if (PutTarget === 'expenses') {
        getter = "getExpensesAmount";
        method = "updateuserExpenses";
    } else {
        getter = "getBudgetAmount";
        method = "updateUserBudget";
    }

    const { data: { id, name, amount, date } } = requestInfo;
    const oldAmount = await db[getter](UserID, id);

    if (!oldAmount) {
        throw new ErrorHandler("Unexisting Data", "There is no matching data in your Database", 404);
    }

    const newData = {
        id,
        name,
        amount,
        date
    }

    const totalAmount = -(oldAmount - amount);
    const status = await db[method](UserID, newData, totalAmount);

    const ServerResponse = new Response("Data Successfully updated", 200, status);

    return ServerResponse;

}

module.exports = updateFunctions;