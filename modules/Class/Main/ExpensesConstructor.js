const uniqid = require('uniqid');

class ExpensesConstructor {
    constructor(name, amount, date) {
        this.id = uniqid();
        this.name = name;
        this.amount = amount;
        this.date = date;
    }
}

module.exports = ExpensesConstructor;