const keys = require('../keys');

module.exports = function(email) {
    return {
        to: email,
        from: keys.emailFrom,
        subject: 'Account has been created',
        html: `
            <h1>Welcome to our shop</h1>
            <p>Вы успешно создали аккаунт c email - ${email}</p>
            <hr />
            
            <a href="${keys.baseUrl}">Course shop</a>
        `,
    }
}
