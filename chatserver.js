var http = require('http');
var server = http.createServer();
server.listen(8080);

exports.chatServer = server;