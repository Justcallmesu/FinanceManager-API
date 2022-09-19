// Response
const Response = require('../Class/Response/Payload.js');

//Error Handler
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// DB
const db = require('../Database/Mongoose.js');

async function updateExpenses(UserID, requestInfo) {
    const { data: { id, name, amount, date } } = requestInfo;
    const oldAmount = await db.getExpensesAmount(UserID, id);

    if (!oldAmount) {
        throw new ErrorHandler("Unexisting Data", "There is no matching data in your Expenses", 404);
    }

    const newData = {
        id,
        name,
        amount,
        date
    }

    const totalAmount = -(oldAmount - amount);
    const status = await db.updateuserExpenses(UserID, newData, totalAmount);

    const ServerResponse = new Response("Data Successfully updated", 200, status);

    return ServerResponse;

}

module.exports = updateExpenses;