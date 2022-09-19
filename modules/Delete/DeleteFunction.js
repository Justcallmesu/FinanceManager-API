// Response
const Response = require('../Class/Response/Payload.js');

//Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// DB
const db = require('../Database/Mongoose.js');

// Validation
const validateTheToken = require('../Functions/Validation-Partials/ValidateTheToken.js');
const validateTheUser = require('../Functions/Validation-Partials/ValidateTheUser.js');

async function deleteFunctions(UserID, requestInfo, deleteTarget) {

    validateTheToken(UserID, requestInfo);
    validateTheUser(UserID);

    let getter = null;
    let method = null;

    if (deleteTarget === 'expenses') {
        getter = "getExpensesAmount";
        method = "deleteUserExpenses";
    } else {
        getter = "getBudgetAmount";
        method = "deleteUserBudget";
    }

    const { itemsID } = requestInfo;
    const itemsAmount = -(await db[getter](UserID, itemsID));

    if (!itemsAmount) {
        throw new ErrorHandler("Unexisting Data", "Data does not exist in the database", 404);
    }

    const status = await (db[method](UserID, itemsID, itemsAmount));
    const serverResponse = new Response('Data SuccessFully Deleted', 200, status);
    return serverResponse;
}

module.exports = deleteFunctions;