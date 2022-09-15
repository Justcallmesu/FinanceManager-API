function getExpiration() {
    const getMiliseconds = new Date().getTime();
    const miliSeconds = 3600 * 1000;
    const expirationDate = getMiliseconds + miliSeconds;

    return expirationDate;
}

module.exports = getExpiration;