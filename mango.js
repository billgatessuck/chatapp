//Mongo Client Setup
var MongoClient = require('mongodb').MongoClient;
var url = require(__dirname + '/db_conn.js').url;
var db = false;
MongoClient.connect(url, function(err, dbase){
	if(err){
		console.log("DB error");
		db = false;
	}
	else{
	console.log("Connected To MongoClient");
    db = dbase;
	}
});

exports.db = function(){
    return db;
}