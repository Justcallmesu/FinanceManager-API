const REGEX = {
    nameREGEX: new RegExp('[A-Za-z_]', 'g'),
    passwordREGEX: new RegExp('[0-9a-zA-Z]', 'ig'),
    emailREGEX: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
}

module.exports = REGEX;