// Class
const Response = require('../Class/Response/Payload.js');
const ExpensesConstructor = require('../Class/Main/ExpensesConstructor.js');

// Functions
const validateTheRequest = require('../Functions/ValidateTheRequest.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function addExpenses(UserID, requestInfo) {
    const isValid = await validateTheRequest(UserID, requestInfo);
    if (isValid) {
        let status = null;
        const { data: { name, amount, date } } = requestInfo;

        const expensesData = new ExpensesConstructor(name, amount, date);
        const doesExist = await db.isExpensesExist(UserID);

        if (doesExist) {
            status = await db.updateUserExpenses(UserID, expensesData);
        } else {
            status = await db.createUserExpenses(UserID, expensesData);
        }
        const serverResponse = new Response("Data Successfully Inserted", 200, status);

        return serverResponse;
    }
    throw new ErrorHandler('Authentication Failed', 'Request Failed authentication Test', 401);
}

module.exports = addExpenses;