// Functions
const getExpiration = require('../../Functions/Getter/GetExpiration.js');

// NPM Module
const uniqid = require('uniqid');

class ExpirationToken {
    constructor() {
        this.token = uniqid();
        this.expiration = getExpiration();
    }
}

module.exports = ExpirationToken;