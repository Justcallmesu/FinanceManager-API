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

app.post("/registration", async (req, res) => {
    const userData = req.body;
    try {
        const status = await Registration(userData);
        const response = new Success("Users Successfully Registered", 201);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(error.status || defaultStatus).json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})

app.post('/login', async (req, res) => {
    const LoginData = req.body;
    try {
        const { status, ...response } = await Login(LoginData);
        res.status(status).json({ status, response });
    } catch (error) {
        res.status(error.status || defaultStatus).json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})


app.listen(app.get("port"), () => {
    console.log("Server is Listening at http://localhost:3000")
})