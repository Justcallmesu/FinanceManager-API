// Class
const Success = require('./modules/Class/Response/Response.js');

// Modules
const Registration = require('./modules/User/RegistrationHandler');
const Login = require('./modules/User/LoginHandler');

// NPM Modules
const express = require('express');
const bodyParser = require('body-parser');


// Framework Initialization
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// APP Variable
app.set("port", process.env.PORT || 3000);

// Variable
const defaultStatus = 400;

// Registration
app.post("/registration", async (req, res) => {
    const userData = req.body;
    try {
        const status = await Registration(userData);
        const response = new Success("Users Successfully Registered", 201);
        res.header({
            "Content-Type": "application/json"
        }).status(response.status).json(response);
    } catch (error) {
        res.header({
            "Content-Type": "application/json"
        }).status(error.status || defaultStatus)
            .json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})


// Login
app.get('/login', async (req, res) => {
    const LoginData = req.body;
    try {
        const { status, ...response } = await Login(LoginData);
        res.header({
            "Content-Type": "application/json"
        }).status(status)
            .json({ status, response });
    } catch (error) {
        res.header({
            "Content-Type": "application/json"
        }).status(error.status || defaultStatus)
            .json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})


// Expenses
app.get('/:UserID/expenses', async function (req, res) {
    const userID = req.params.UserID;
    const requestInfo = req.body;
    try {

    } catch (error) {

    }
    res.end();
})

app.post('/:UserID/expenses', async function (req, res) {

})


app.listen(app.get("port"), () => {
    console.log("Server is Listening at http://localhost:3000")
})