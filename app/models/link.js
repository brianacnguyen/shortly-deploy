var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Link = mongoose.model('Link', db.urlsSchema);

db.urlsSchema.pre('save', function(next) {
  var shashum = crypto.createHash('sha1');
  shashum.update(this.url);
  this.code = shashum.digest('hex').slice(0, 5);
  next(); 
});
// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
// var l = new Link({ url: 'http://www.google.com', base_url: 'http://google.com', title: 'google', visits: 0});
// l.save();