// Class
const TokenConstructor = require('./TokenConstructor.js');


class DataConstructor {
    constructor(firstname, lastname, password, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.email = email;
        this.token = new TokenConstructor();
    }
}


module.exports = DataConstructor;