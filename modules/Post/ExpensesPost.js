// Class
const Response = require('../Class/Response/Payload.js');
const BudgetExpensesConstructor = require('../Class/Main/BudgetExpensesConstructor.js');

// Functions
const validateTheRequest = require('../Functions/Validation-Main/ValidateThePost.js');

// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function addExpenses(UserID, requestInfo) {
    const isValid = await validateTheRequest(UserID, requestInfo);
    if (isValid) {
        let status = null;
        const [doesExist, totalBudget, totalExpenses] = await Promise.all([
            db.isExpensesExist(UserID),
            db.getTotalBudget(UserID),
            db.getTotalExpenses(UserID)
        ]);

        const { data: { name, amount, date } } = requestInfo;
        console.log(totalExpenses);
        if ((totalExpenses + amount) >= totalBudget) {
            throw new ErrorHandler("Invalid Data", "Total Expenses is Greater Than total Budget", 400);
        }
        const expensesData = new BudgetExpensesConstructor(name, amount, date);

        if (doesExist) {
            status = await db.pushUserExpenses(UserID, expensesData);
        } else {
            status = await db.createUserExpenses(UserID, expensesData);
        }
        const serverResponse = new Response("Data Successfully Inserted", 200, status);

        return serverResponse;
    }
    throw new ErrorHandler('Authentication Failed', 'Request Failed authentication Test', 401);
}

module.exports = addExpenses;