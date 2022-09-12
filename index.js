// Class
const Success = require('./modules/Class/Response/Response.js');

// Modules
const registration = require('./modules/User/RegistrationHandler');

// NPM Modules
const express = require('express');
const bodyParser = require('body-parser');


// Framework Initialization
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// APP Variable
app.set("port", process.env.PORT || 3000);

app.post("/registration", async (req, res) => {
    const userData = req.body;
    try {
        const status = await registration(req.body);
        const response = new Success("Users Successfully Registered", 201);
        res.status(response.status).json(response);
    } catch (error) {
        const defaultStatus = 400;
        res.status(error.status || defaultStatus).json({ status: error.status || defaultStatus, message: error.message, ...error });
    }
    res.end();
})

app.post('/login', async (req, res) => {
    const userData = req.body;
    try {

    } catch {

    }
    res.end();
})


app.listen(app.get("port"), () => {
    console.log("Server is Listening at http://localhost:3000")
})