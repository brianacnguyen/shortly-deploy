var app = require('./server.js');

// var port = 4568;
var port = process.env.PORT;

app.listen(port);

console.log('Server now listening on port ' + port);
