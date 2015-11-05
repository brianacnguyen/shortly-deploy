var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

db.usersSchema.pre('save', function(next, done) {
    var that = this;
    bcrypt.hash(this.password, null, null, function(err, hash) {
      that.password = hash;
      next();
    })
});

var User = mongoose.model('User', db.usersSchema);

// User.prototype.hashPassword = function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.password, null, null).bind(this)
//         .then(function(hash) {
//             this.password = hash
//         });
// };

User.prototype.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
        callback(isMatch);
    });
}

    // var User = db.Model.extend({
    //   tableName: 'users',
    //   hasTimestamps: true,
    //   initialize: function(){
    //     this.on('creating', this.hashPassword);
    //   },
    //   comparePassword: function(attemptedPassword, callback) {
    //     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    //       callback(isMatch);
    //     });
    //   },
    //   hashPassword: function(){
    //     var cipher = Promise.promisify(bcrypt.hash);
    //     return cipher(this.get('password'), null, null).bind(this)
    //       .then(function(hash) {
    //         this.set('password', hash);
    //       });
    //   }
    // });

module.exports = User;
// var u = new User({ username: 'newuser', password: 'test123'});
// u.save();