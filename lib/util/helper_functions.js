module.exports = (function () {

    const updatePassword = (knexobj, emailInput, oldPassword, newPassword) => {
        return authenticate(knexobj, emailInput, oldPassword)
        .then(function(passwordMatches) {
            if(passwordMatches) {
                return knexobj.select('*')
                .from('user_credentials')
                .where('email', emailInput)
                .update('password', newPassword)
            } else {
                return false;
            }
        });
    };

    const lookupEmail = (knexobj, emailInput) => {
        return knexobj.select('*').from('user_credentials').where('email', emailInput)
        .then(function(user) {
            return user;
        });
    };

    const comparePassword = (passwordInput, user) => {
        return new Promise((resolve, reject) => {
            if (passwordInput === user.password) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    const findId = (knexobj, email) => {
        return lookupEmail(knexobj, email)
        .then(function(user) {
            return user[0].id;
        })
    }

    const authenticate = (knexobj, email, passwordInput) => {
        return lookupEmail(knexobj, email)
        .then(function (user) {
            return comparePassword(passwordInput, user[0])
        })
    }

    return {
        authenticate:authenticate,
        updatePassword:updatePassword,
        findId:findId
    }

})()