class RegistrationError extends Error {
    constructor(name, message, statusCode) {
        super(message);
        this.name = name;
        this.status = statusCode;
    }
}

module.exports = RegistrationError;