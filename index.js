// Class
const Success = require('./modules/Class/Response/Response.js');

// Modules
const Registration = require('./modules/User/RegistrationHandler');
const Login = require('./modules/User/LoginHandler');

const ExpensesPost = require('./modules/Post/ExpensesPost.js');
const BudgetPost = require('./modules/Post/BudgetPost.js');

// NPM Modules
const express = require('express');
const bodyParser = require('body-parser');

// Functions
const getFunction = require('./modules/Get/GetFunction.js');

// Framework Initialization
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// APP Variable
app.set("port", process.env.PORT || 3000);

// Headers Config
const Headers = {
    'Content-Type': 'application/json'
}

// Variable
const defaultStatus = 400;

// Registration
app.post("/registration", async (req, res) => {
    const userData = req.body;
    try {
        const status = await Registration(userData);
        const response = new Success("Users Successfully Registered", 201);
        res.header(Headers).status(response.status).json(response);
    } catch (error) {
        const { message, status } = error;
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})


// Login
app.post('/login', async (req, res) => {
    const LoginData = req.body;
    try {
        const { status, ...response } = await Login(LoginData);
        res.header(Headers).status(status)
            .json({ status, ...response });
    } catch (error) {
        const { message, status } = error;
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})


// Expenses
app.get('/:UserID/expenses', async function (req, res) {
    const userID = req.params.UserID;
    const requestInfo = req.body;
    try {
        const { status, ...data } = await getFunction(userID, requestInfo, "getUserExpenses");
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        const { message, status } = error;
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})

app.post('/:UserID/expenses', async function (req, res) {
    const userID = req.params.UserID;
    const requestInfo = req.body;

    try {
        const { status, ...data } = await ExpensesPost(userID, requestInfo);
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        const { message, status } = error;
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})


// Budget
app.get('/:UserID/budgets', async function (req, res) {
    const UserID = req.params.UserID;
    const requestInfo = req.body;

    try {
        const { status, ...data } = await getFunction(UserID, requestInfo, 'getUserBudget');
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        const { message, status } = error;
        console.log(message);
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})

app.post('/:UserID/budgets', async function (req, res) {
    const UserID = req.params.UserID;
    const requestInfo = req.body;

    try {
        const { status, ...data } = await BudgetPost(UserID, requestInfo);
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        const { message, status } = error;
        res.status(status || defaultStatus).header(Headers).json({ message, ...error });
    }
    res.end();
})


app.listen(app.get("port"), () => {
    console.log("Server is Listening at http://localhost:3000")
})