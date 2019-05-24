module.exports = (function () {

    
    const lookupEmail = (knexobj, emailInput) => {
        return knexobj.select('*').from('user_credentials').where('email', emailInput)
        .then(function(result) {
            return result;
        });
    };

    const comparePassword = (passwordInput, user) => {
        return new Promise((resolve, reject) => {
            console.log(passwordInput)
            console.log(user.password)
            if (passwordInput === user.password) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    const authenticate = (knexobj, email, passwordInput) => {
        return lookupEmail(knexobj, email)
        .then(function (user) {
            console.log(user);
            return comparePassword(passwordInput, user[0])
        })
    }

    return {
        authenticate:authenticate
    }

})()