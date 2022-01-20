const keys = require('../keys');

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.emailFrom,
        subject: 'Access recovery',
        html: `
            <h1>Forgot password?</h1>
            <p>If no, just ignore this mail</p>
            <p>Else, click on link</p>
            <p><a href="${keys.baseUrl}/auth/password/${token}">Recover access</a></p>
            <hr />
            
            <a href="${keys.baseUrl}">Course shop</a>
        `,
    }
}
