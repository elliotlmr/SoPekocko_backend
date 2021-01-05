const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Split le mot 'Bearer' et le Token, puis récupère le 2eme element
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_FOR_PIQUANTE__NEED_TO_BE_DEFINED');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({error: error | 'Requête non authentifiée !'});
    }
};