//to import mongodb 
var MongoClient = require('mongodb').MongoClient;
//mydb is the new database we want to create
var url = "mongodb://localhost:27017/mydb";
//make client connect 
MongoClient.connect(url, function (err, client) {
    var db = client.db('mydb');
    if (err) throw err;
    //customers is a collection we  want to create                             
    db.createCollection("customers", function (err, result) {
        if (err) throw err;
        console.log("database and Collection created!");
        client.close();
    });
});