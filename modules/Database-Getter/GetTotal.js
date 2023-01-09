// Class
const Response = require('../Class/Response/Payload.js');

// Functions
const validateTheUser = require('../Functions/Validation-Partials/ValidateTheUser.js')
const validateTheToken = require('../Functions/Validation-Partials/ValidateTheToken.js')


// Error
const ErrorHandler = require('../Class/Error/ErrorHandler.js');

// Db
const db = require('../Database/Mongoose.js');

async function getTotal(userId, requestInfo) {
    if ("token" in requestInfo) {
        await validateTheUser(userId);
        await validateTheToken(userId, requestInfo);

        const [budgetTotal, expensesTotal] = await Promise.all(
            [
                db.getTotalBudget(userId),
                db.getTotalExpenses(userId)
            ]);

        const serverResponse = new Response("Data Successfully Fetched", 200, { budgetTotal, expensesTotal })
        return serverResponse;
    } else {
        throw new ErrorHandler('Missing Data', 'Please Include Token', 400);
    }
}

module.exports = getTotal;