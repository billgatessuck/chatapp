var fs = require('fs');
var express = require('express');
var compression = require('compression');
var db = require(__dirname + '/mango.js').db;
var app = express();
var bodyparser = require('body-parser');
var sessions = require('client-sessions');
var server = app.listen(80);
app.use(compression());
app.use(express.static(__dirname + '/html/static'));

var sessionkey = require(__dirname + '/secret.js');
var session = sessions({
  cookieName: 'permitted',
  secret: sessionkey,
  duration: 24*60*60*1000,
  activeDuration: 24 * 60 * 60 * 1000,
  httpOnly: true,
  ephemeral: true
});

app.use(session);
app.get('/', function(req,res){
  if(!req.permitted.permission){
    res.redirect('/login');
    return;
  }
  if(req.permitted.permission != 'OK'){
    res.redirect('/login');
    return; 
  }

  fs.readFile(__dirname + '/html/index.html', function(err, data){
    if(err){
      console.log("Error reading file");
      res.writeHead(500);
      res.write("Something went wrong");
    }
    else{
      res.writeHead(200, {'Content-type': 'text/html'});
      res.write(data);
    }
    res.end();
  });
});

app.get('/chatmsg', function(req, res){
  var cursor = db().collection('chat').find({}, {_id: 0}).limit(100).toArray(function(err, doc){
      if(err){
        console.log("Error Reading ChatLog");
      }
      else{
        if(doc!=null){
          res.json(JSON.stringify(doc));
        }
        else{
          console.log('null doc');
        }
      }
      res.end();
  });
});

app.get('/login', function(req, res){
  fs.readFile(__dirname + '/html/login.html', function(err, data){
    if(err){
      res.redirect('/');
    }
    else{
      res.end(data);
    }
  });
});  


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.post('/authenticate', function(req, res){
  var pass = req.body.pass || null;
  if(pass == 'hello'){
    req.permitted.permission = 'OK';
    res.redirect('/');
  }
  else{
    req.permitted.permission = 'notOK';
    res.redirect('/login');
  }
});

app.get('/logout', function(req, res){
  req.permitted.reset();
  res.redirect('/');
})

exports.sessionvar = session;
exports.fileServer = server;
