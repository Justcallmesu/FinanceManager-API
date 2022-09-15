// Class
const Response = require('../Class/Response/Payload.js');
const BudgetExpensesConstructor = require('../Class/Main/BudgetExpensesConstructor.js');

// Functions
const validateTheRequest = require('../Functions/Validation-Main/ValidateThePost.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function addBudget(UserID, requestInfo) {
    const isValid = await validateTheRequest(UserID, requestInfo);
    if (isValid) {
        let status = null;
        const { data: { name, amount, date } } = requestInfo;

        const expensesData = new BudgetExpensesConstructor(name, amount, date);
        const doesExist = await db.isBudgetExist(UserID);

        if (doesExist) {
            status = await db.updateUserBudget(UserID, expensesData);
        } else {
            status = await db.createUserBudget(UserID, expensesData);
        }
        const serverResponse = new Response("Data Successfully Inserted", 200, status);

        return serverResponse;
    }
    throw new ErrorHandler('Authentication Failed', 'Request Failed authentication Test', 401);
}

module.exports = addBudget;