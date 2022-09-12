// NPM Module
const uniqid = require('uniqid');

// Class
const TokenConstructor = require('./TokenConstructor.js');

// Functions
const getExpiration = require('../../Functions/GetExpiration.js');

class DataConstructor {
    constructor(firstname, lastname, password, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.email = email;
        this.token = new TokenConstructor(uniqid(), getExpiration());
    }
}


module.exports = DataConstructor;