

var db = require(__dirname + '/mango.js').db;

require(__dirname + '/express.js');

//Chat Server
var chatserver = require(__dirname + '/chatserver.js').chatServer;
var io = require('socket.io')(chatserver);


var online_user_num = 0;

io.use(function(socket, next){
  console.log(socket.request);
  next();
});

io.on('connection', function(socket){
  online_user_num++;
  io.emit('userconn', online_user_num + ' users online currently');
  socket.on('message', function(data){
		if(typeof data !== 'string'){
			return;
		}
		if(data.trim() == ''){
			return;
		}
    var date = new Date();
    date = date.getTime();
    socket.broadcast.emit('cmessage', {'data': data, 'time': date});
    d = new Date();
		if(db()){
			db().collection('chat').save({
			'time' : d.getTime(),
			'message' : data
			});
		}



  });

  socket.on('disconnect', function(){
    online_user_num--;
    io.emit('userconn', online_user_num + ' users online currently');
  });
});
