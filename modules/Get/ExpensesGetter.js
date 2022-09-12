// Db
const db = require('../Database/Mongoose.js')

async function validateTheRequest(userID, data) {
    const userExist = await db.getExpiration(userID);
    console.log(userExist);
}