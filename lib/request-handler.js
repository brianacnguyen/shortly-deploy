var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
    res.render('index');
};

exports.signupUserForm = function(req, res) {
    res.render('signup');
};

exports.loginUserForm = function(req, res) {
    res.render('login');
};

exports.logoutUser = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/login');
    });
};

exports.fetchLinks = function(req, res) {
    Link.find({}, function(err, links) {
        res.send(200, links);
    });
};

exports.saveLink = function(req, res) {
    var uri = req.body.url;

    if (!util.isValidUrl(uri)) {
        console.log('Not a valid url: ', uri);
        return res.send(404);
    }
    Link.findOne({
        url: uri
    }, function(err, link) {
        if (link) {
            res.send(200, link)
        } else {
            util.getUrlTitle(uri, function(err, title) {
                if (err) {
                    console.log('Error reading URL heading: ', err);
                    return res.send(404);
                }

                var link = new Link({
                    url: uri,
                    title: title,
                    base_url: req.headers.origin,
                    visits: 0
                });
                link.save(function(err, link) {
                    if (err) {
                        res.send(404, err);
                    } else {
                        res.send(200, link);
                    }
                });
            });
        }
    });
    // new Link({ url: uri }).fetch().then(function(found) {
    //   if (found) {
    //     res.send(200, found.attributes);
    //   } else {
    //     util.getUrlTitle(uri, function(err, title) {
    //       if (err) {
    //         console.log('Error reading URL heading: ', err);
    //         return res.send(404);
    //       }

    //       var link = new Link({
    //         url: uri,
    //         title: title,
    //         base_url: req.headers.origin
    //       });

    //       link.save().then(function(newLink) {
    //         Links.add(newLink);
    //         res.send(200, newLink);
    //       });
    //     });
    //   }
    // });
};

exports.loginUser = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username: username
    }, function(err, user) {
        console.log(user);
        if (!user) {
            res.redirect('/login');
        } else {
            user.comparePassword(password, function(match) {
                if (match) {
                    util.createSession(req, res, user);
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
    // new User({ username: username })
    //   .fetch()
    //   .then(function(user) {
    //     if (!user) {
    //       res.redirect('/login');
    //     } else {
    //       user.comparePassword(password, function(match) {
    //         if (match) {
    //           util.createSession(req, res, user);
    //         } else {
    //           res.redirect('/login');
    //         }
    //       })
    //     }
    // });
};

exports.signupUser = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        username: username
    }, function(err, user) {
        if (!user) {
            var newUser = new User({
                username: username,
                password: password
            });
            newUser.save(function(err, newUser) {
                if (err) {
                    res.send(404, err);
                } else {
                    util.createSession(req, res, newUser);
                }
            });
        } else {
            console.log('Account already exists');
            res.redirect('/signup');
        }
    });
    // new User({ username: username })
    //   .fetch()
    //   .then(function(user) {
    //     if (!user) {
    //       var newUser = new User({
    //         username: username,
    //         password: password
    //       });
    //       newUser.save()
    //         .then(function(newUser) {
    //           util.createSession(req, res, newUser);
    //           Users.add(newUser);
    //         });
    //     } else {
    //       console.log('Account already exists');
    //       res.redirect('/signup');
    //     }
    //   })
};

exports.navToLink = function(req, res) {
    Link.findOne({
        code: req.params[0]
    }, function(err, link) {
        if (!link) {
            res.redirect('/');
        } else {
            link.visits += 1;
            link.save(function(err, link) {
                res.redirect(link.url);
            });
        }
    });
    // new Link({ code: req.params[0] }).fetch().then(function(link) {
    //   if (!link) {
    //     res.redirect('/');
    //   } else {
    //     link.set({ visits: link.get('visits') + 1 })
    //       .save()
    //       .then(function() {
    //         return res.redirect(link.get('url'));
    //       });
    //   }
    // });
};
