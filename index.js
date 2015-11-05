var app = require('./server.js');

// var port = 4568;
var port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 4568;
}

app.listen(port);

console.log('Server now listening on port ' + port);
