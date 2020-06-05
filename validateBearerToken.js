const { API_TOKEN } = require('./config')

function validateBearerToken(req, res, next) {
    let token = req.get('Authorization') || ''
    token = token.split(' ')[1]
    if (!token || token !== API_TOKEN) {
        return res.status(401).json({ error: 'Authorization declined' })
    }
    next();
}

module.exports = validateBearerToken;