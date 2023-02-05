var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const { use } = require('../routes/users');

const User = mongoose.Schema({
    name: {type: String, required: false},
    surname: {type: String, required: false},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true}
})

User.pre('save', function(next){
    var user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

User.methods.passwordMatches = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, function(err, match){
            if (err) {
                return reject(err);
            }
            resolve(match);
        });
    })
}

module.exports = mongoose.model('User', User);
