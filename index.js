// Class
const Success = require('./modules/Class/Response/Response.js');

// Modules
const Registration = require('./modules/User/RegistrationHandler');
const Login = require('./modules/User/LoginHandler');

const ExpensesGetter = require('./modules/Get/ExpensesGetter.js');
const ExpensesPost = require('./modules/Post/ExpensesPost.js');

const BudgetGetter = require('./modules/Get/BudgetGetter.js');

// NPM Modules
const express = require('express');
const bodyParser = require('body-parser');


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
        res.header(Headers).status(error.status || defaultStatus)
            .json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})


// Login
app.get('/login', async (req, res) => {
    const LoginData = req.body;
    try {
        const { status, ...response } = await Login(LoginData);
        res.header(Headers).status(status)
            .json({ status, ...response });
    } catch (error) {
        res.header(Headers).status(error.status || defaultStatus)
            .json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})


// Expenses
app.get('/:UserID/expenses', async function (req, res) {
    const userID = req.params.UserID;
    const requestInfo = req.body;
    try {
        const { status, ...data } = await ExpensesGetter(userID, requestInfo);
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        res.status(error.status || defaultStatus).header(Headers).send(error);
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
        res.status(error.status || defaultStatus).header(Headers).json(error);
    }
    res.end();
})


// Budget
app.get('/:UserID/budgets', async function (req, res) {
    const UserID = req.params.UserID;
    const requestInfo = req.body;

    try {
        const { status, ...data } = await BudgetGetter(UserID, requestInfo);
        res.status(status).header(Headers).json({ status, ...data });
    } catch (error) {
        res.status(error.status || defaultStatus).header(Headers).json(error);
    }
    res.end();
})


app.listen(app.get("port"), () => {
    console.log("Server is Listening at http://localhost:3000")
})