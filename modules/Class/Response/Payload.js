const Response = require('./Response.js');

class Payload extends Response {
    constructor(message, status, payload) {
        super(message, status);
        this.payload = payload;
    }
}

module.exports = Payload;